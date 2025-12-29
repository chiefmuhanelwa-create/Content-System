import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL || '');

    const body = await request.json();

    // Extract fields from request body
    const {
      content_intent,
      paids_stream,
      seeds_stage,
      content_type,
      platform,
      content_pillar,
      laws_upheld,
      story_bank_reference,
      pain_point,
      desired_outcome,
      cta_next_step,
      product_tier,
      max_length,
      signature_phrase,
      framework_reference,
      additional_context,
    } = body;

    // Validation
    if (!content_intent || !seeds_stage || !content_type || !content_pillar ||
        !pain_point || !desired_outcome || !cta_next_step || !product_tier ||
        !framework_reference) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(paids_stream) || paids_stream.length === 0) {
      return NextResponse.json(
        { message: 'At least one PAIDS stream is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(platform) || platform.length === 0) {
      return NextResponse.json(
        { message: 'At least one platform is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(laws_upheld) || laws_upheld.length === 0) {
      return NextResponse.json(
        { message: 'At least one law must be selected' },
        { status: 400 }
      );
    }

    // Insert into database (using user_id = 1 since we removed auth)
    const result = await sql`
      INSERT INTO content_requests (
        user_id,
        content_intent,
        paids_stream,
        seeds_stage,
        content_type,
        platform,
        content_pillar,
        laws_upheld,
        story_bank_reference,
        pain_point,
        desired_outcome,
        cta_next_step,
        product_tier,
        max_length,
        signature_phrase,
        framework_reference,
        additional_context,
        status
      ) VALUES (
        1,
        ${content_intent},
        ${paids_stream},
        ${seeds_stage},
        ${content_type},
        ${platform},
        ${content_pillar},
        ${laws_upheld},
        ${story_bank_reference || null},
        ${pain_point},
        ${desired_outcome},
        ${cta_next_step},
        ${product_tier},
        ${max_length ? parseInt(max_length) : null},
        ${signature_phrase || null},
        ${framework_reference},
        ${additional_context || null},
        'pending'
      )
      RETURNING id, content_intent, content_type, content_pillar, status, created_at
    `;

    return NextResponse.json({
      message: 'Content request created successfully',
      id: result[0].id,
      content: result[0],
    }, { status: 201 });

  } catch (error: any) {
    console.error('Content creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
