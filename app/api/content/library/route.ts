import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'Database not configured', content: [], count: 0 },
        { status: 500 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const intent = searchParams.get('intent');
    const status = searchParams.get('status');
    const pillar = searchParams.get('pillar');

    // Fetch all content first, then filter in JavaScript
    // This is simpler and works reliably with Neon serverless
    const allContent = await sql`
      SELECT
        cr.id,
        cr.content_intent,
        cr.content_type,
        cr.content_pillar,
        cr.status,
        cr.created_at,
        gc.content_text,
        gc.word_count,
        vr.total_score,
        vr.decision
      FROM content_requests cr
      LEFT JOIN generated_content gc ON gc.content_request_id = cr.id
      LEFT JOIN vetting_results vr ON vr.generated_content_id = gc.id
      ORDER BY cr.created_at DESC
      LIMIT 100
    `;

    // Apply filters in JavaScript
    let content = allContent;

    if (intent && intent !== 'all') {
      content = content.filter((item: any) => item.content_intent === intent);
    }

    if (status && status !== 'all') {
      content = content.filter((item: any) => item.status === status);
    }

    if (pillar && pillar !== 'all') {
      content = content.filter((item: any) => item.content_pillar === pillar);
    }

    return NextResponse.json({
      content,
      count: content.length,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Library fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message, content: [], count: 0 },
      { status: 500 }
    );
  }
}
