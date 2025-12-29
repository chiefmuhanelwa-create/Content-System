import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import Anthropic from '@anthropic-ai/sdk';
import { FOUNDATION_PROMPT, GENERATION_ENGINE_PROMPT } from '@/lib/prompts';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = neon(process.env.DATABASE_URL || '');
    const contentId = parseInt(params.id);

    // Fetch content request
    const requests = await sql`
      SELECT * FROM content_requests WHERE id = ${contentId}
    `;

    if (requests.length === 0) {
      return NextResponse.json(
        { message: 'Content request not found' },
        { status: 404 }
      );
    }

    const contentRequest = requests[0];

    // Build generation prompt
    const userPrompt = `
CONTENT REQUEST:

Strategic Intent:
- Content Intent (4E): ${contentRequest.content_intent}
- PAIDS Streams: ${contentRequest.paids_stream.join(', ')}
- SEEDS Stage: ${contentRequest.seeds_stage}

Content Details:
- Type: ${contentRequest.content_type}
- Platform: ${contentRequest.platform.join(', ')}
- Pillar: ${contentRequest.content_pillar}

Strategic Alignment:
- Laws to Emphasize: ${contentRequest.laws_upheld.join(', ')}
- Pain Point: ${contentRequest.pain_point}
- Desired Outcome: ${contentRequest.desired_outcome}
${contentRequest.story_bank_reference ? `- Story Reference: ${contentRequest.story_bank_reference}` : ''}

CTA & Specifications:
- Call-to-Action: ${contentRequest.cta_next_step}
- Product Tier: ${contentRequest.product_tier}
- Framework: ${contentRequest.framework_reference}
${contentRequest.max_length ? `- Max Length: ${contentRequest.max_length} characters` : ''}
${contentRequest.signature_phrase ? `- Signature Phrase: ${contentRequest.signature_phrase}` : ''}
${contentRequest.additional_context ? `- Additional Context: ${contentRequest.additional_context}` : ''}

TASK: Generate content following the NOCHILL Content Governance System's Constitutional Law.
    `;

    // Call Anthropic API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: FOUNDATION_PROMPT + '\n\n' + GENERATION_ENGINE_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract content text
    const contentText = message.content[0].type === 'text' ? message.content[0].text : '';
    const wordCount = contentText.split(/\s+/).length;

    // Save generated content to database
    const generated = await sql`
      INSERT INTO generated_content (
        content_request_id,
        content_text,
        word_count,
        estimated_duration
      ) VALUES (
        ${contentId},
        ${contentText},
        ${wordCount},
        ${Math.ceil(wordCount / 150)}
      )
      RETURNING *
    `;

    // Update content request status
    await sql`
      UPDATE content_requests
      SET status = 'generated', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${contentId}
    `;

    return NextResponse.json({
      message: 'Content generated successfully',
      request: contentRequest,
      generated: generated[0],
    }, { status: 200 });

  } catch (error: any) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
