import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL || '');

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const intent = searchParams.get('intent');
    const status = searchParams.get('status');
    const pillar = searchParams.get('pillar');

    // Build dynamic WHERE clauses
    const conditions: string[] = [];
    const params: any[] = [];

    if (intent && intent !== 'all') {
      conditions.push(`cr.content_intent = $${params.length + 1}`);
      params.push(intent);
    }

    if (status && status !== 'all') {
      conditions.push(`cr.status = $${params.length + 1}`);
      params.push(status);
    }

    if (pillar && pillar !== 'all') {
      conditions.push(`cr.content_pillar = $${params.length + 1}`);
      params.push(pillar);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Fetch content with joins
    const content = await sql`
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
      ${whereClause ? sql.unsafe(whereClause) : sql``}
      ORDER BY cr.created_at DESC
      LIMIT 100
    `;

    return NextResponse.json({
      content,
      count: content.length,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Library fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
