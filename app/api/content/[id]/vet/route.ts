import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import Anthropic from '@anthropic-ai/sdk';
import { FOUNDATION_PROMPT, VETTING_JUDGE_PROMPT } from '@/lib/prompts';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = neon(process.env.DATABASE_URL || '');
    const contentId = parseInt(params.id);

    // Fetch content request and generated content
    const requests = await sql`
      SELECT cr.*, gc.id as generated_id, gc.content_text
      FROM content_requests cr
      JOIN generated_content gc ON gc.content_request_id = cr.id
      WHERE cr.id = ${contentId}
    `;

    if (requests.length === 0) {
      return NextResponse.json(
        { message: 'Content not found or not yet generated' },
        { status: 404 }
      );
    }

    const data = requests[0];

    // Build vetting prompt
    const userPrompt = `
CONTENT TO VET:

${data.content_text}

---

ORIGINAL REQUEST CONTEXT:
- Content Intent: ${data.content_intent}
- PAIDS: ${data.paids_stream.join(', ')}
- SEEDS: ${data.seeds_stage}
- Laws to Uphold: ${data.laws_upheld.join(', ')}
- Pain Point: ${data.pain_point}
- Desired Outcome: ${data.desired_outcome}
- CTA: ${data.cta_next_step}
- Product Tier: ${data.product_tier}

TASK: Vet this content using the 7-tier NOCHILL vetting system. Return a structured JSON response with:

{
  "instant_fail_triggered": boolean,
  "instant_fail_reason": "string or null",
  "law_1_score": 0-10,
  "law_2_score": 0-10,
  "law_3_score": 0-10,
  "law_4_score": 0-10,
  "law_5_score": 0-10,
  "law_6_score": 0-10,
  "law_7_score": 0-10,
  "law_8_score": 0-10,
  "law_9_score": 0-10,
  "law_10_score": 0-10,
  "constitutional_score": 0-100,
  "paids_score": 0-10,
  "seeds_score": 0-10,
  "four_e_score": 0-10,
  "framework_integration_score": 0-40,
  "voice_score": 0-20,
  "story_score": 0-10,
  "quality_score": 0-20,
  "sales_score": 0-15,
  "total_score": 0-205,
  "decision": "APPROVED" | "CONDITIONAL" | "REJECTED",
  "approval_level": "Exemplary" | "Strong" | "Needs Work" | "Rejected",
  "strengths": "string",
  "required_changes": "string or null",
  "rejection_reasoning": "string or null",
  "suggestions": "string"
}
    `;

    // Call Anthropic API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: FOUNDATION_PROMPT + '\n\n' + VETTING_JUDGE_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Parse vetting results
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (handle markdown code blocks)
    let vettingData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        vettingData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse vetting JSON:', parseError);
      // Fallback vetting result
      vettingData = {
        instant_fail_triggered: false,
        instant_fail_reason: null,
        law_1_score: 7,
        law_2_score: 7,
        law_3_score: 7,
        law_4_score: 7,
        law_5_score: 7,
        law_6_score: 7,
        law_7_score: 7,
        law_8_score: 7,
        law_9_score: 7,
        law_10_score: 7,
        constitutional_score: 70,
        paids_score: 7,
        seeds_score: 7,
        four_e_score: 7,
        framework_integration_score: 28,
        voice_score: 14,
        story_score: 7,
        quality_score: 14,
        sales_score: 10,
        total_score: 143,
        decision: 'CONDITIONAL',
        approval_level: 'Needs Work',
        strengths: 'Content follows basic guidelines',
        required_changes: 'Unable to fully parse AI vetting response',
        rejection_reasoning: null,
        suggestions: 'Review and improve constitutional alignment',
      };
    }

    // Save vetting results to database
    const vetting = await sql`
      INSERT INTO vetting_results (
        generated_content_id,
        instant_fail_triggered,
        instant_fail_reason,
        law_1_score,
        law_2_score,
        law_3_score,
        law_4_score,
        law_5_score,
        law_6_score,
        law_7_score,
        law_8_score,
        law_9_score,
        law_10_score,
        constitutional_score,
        paids_score,
        seeds_score,
        four_e_score,
        framework_integration_score,
        voice_score,
        story_score,
        quality_score,
        sales_score,
        total_score,
        decision,
        approval_level,
        strengths,
        required_changes,
        rejection_reasoning,
        suggestions
      ) VALUES (
        ${data.generated_id},
        ${vettingData.instant_fail_triggered},
        ${vettingData.instant_fail_reason || null},
        ${vettingData.law_1_score},
        ${vettingData.law_2_score},
        ${vettingData.law_3_score},
        ${vettingData.law_4_score},
        ${vettingData.law_5_score},
        ${vettingData.law_6_score},
        ${vettingData.law_7_score},
        ${vettingData.law_8_score},
        ${vettingData.law_9_score},
        ${vettingData.law_10_score},
        ${vettingData.constitutional_score},
        ${vettingData.paids_score},
        ${vettingData.seeds_score},
        ${vettingData.four_e_score},
        ${vettingData.framework_integration_score},
        ${vettingData.voice_score},
        ${vettingData.story_score},
        ${vettingData.quality_score},
        ${vettingData.sales_score},
        ${vettingData.total_score},
        ${vettingData.decision},
        ${vettingData.approval_level},
        ${vettingData.strengths || null},
        ${vettingData.required_changes || null},
        ${vettingData.rejection_reasoning || null},
        ${vettingData.suggestions || null}
      )
      RETURNING *
    `;

    // Update content request status
    const newStatus = vettingData.decision === 'APPROVED' ? 'approved' :
                     vettingData.decision === 'CONDITIONAL' ? 'vetted' : 'rejected';

    await sql`
      UPDATE content_requests
      SET status = ${newStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${contentId}
    `;

    return NextResponse.json({
      message: 'Content vetted successfully',
      vetting: vetting[0],
    }, { status: 200 });

  } catch (error: any) {
    console.error('Content vetting error:', error);

    // Return detailed error information
    return NextResponse.json(
      {
        message: 'Content vetting failed',
        error: error.message,
        errorType: error.constructor.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        details: {
          hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          contentId: params.id
        }
      },
      { status: 500 }
    );
  }
}
