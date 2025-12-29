import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL || '');
    const userId = 1; // Fixed user ID since we removed auth

    // Fetch weekly stats
    const weeklyStats = await sql`
      SELECT
        mt.*
      FROM mastery_tracking mt
      WHERE mt.user_id = ${userId}
      ORDER BY mt.week_number DESC
      LIMIT 12
    `;

    // Calculate overall stats
    const overallStats = await sql`
      SELECT
        COUNT(cr.id) as total_pieces,
        COUNT(CASE WHEN cr.status = 'approved' THEN 1 END) as approved_count,
        AVG(vr.total_score) as avg_score
      FROM content_requests cr
      LEFT JOIN generated_content gc ON gc.content_request_id = cr.id
      LEFT JOIN vetting_results vr ON vr.generated_content_id = gc.id
      WHERE cr.user_id = ${userId}
    `;

    const totalPieces = parseInt(overallStats[0]?.total_pieces || '0');
    const approvedCount = parseInt(overallStats[0]?.approved_count || '0');
    const overallApprovalRate = totalPieces > 0 ? (approvedCount / totalPieces) * 100 : 0;
    const avgScore = parseFloat(overallStats[0]?.avg_score || '0');

    // Calculate trend
    let trend = 'stable';
    if (weeklyStats.length >= 2) {
      const recent = parseFloat(weeklyStats[0]?.avg_total_score || '0');
      const previous = parseFloat(weeklyStats[1]?.avg_total_score || '0');
      if (recent > previous + 5) trend = 'improving';
      else if (recent < previous - 5) trend = 'declining';
    }

    // Find law violations (scores < 7)
    const violations = await sql`
      SELECT
        'Law 1: Africa First' as law,
        COUNT(*) as count,
        AVG(law_1_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_1_score < 7
      GROUP BY law
      UNION ALL
      SELECT
        'Law 2: Own Your Content' as law,
        COUNT(*) as count,
        AVG(law_2_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_2_score < 7
      GROUP BY law
      UNION ALL
      SELECT
        'Law 3: Build in Public' as law,
        COUNT(*) as count,
        AVG(law_3_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_3_score < 7
      GROUP BY law
      UNION ALL
      SELECT
        'Law 4: Long-term Thinking' as law,
        COUNT(*) as count,
        AVG(law_4_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_4_score < 7
      GROUP BY law
      UNION ALL
      SELECT
        'Law 5: Multiple Revenue Streams' as law,
        COUNT(*) as count,
        AVG(law_5_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_5_score < 7
      GROUP BY law
      UNION ALL
      SELECT
        'Law 6: Systems Over Hustle' as law,
        COUNT(*) as count,
        AVG(law_6_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_6_score < 7
      GROUP BY law
      UNION ALL
      SELECT
        'Law 7: Community First' as law,
        COUNT(*) as count,
        AVG(law_7_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_7_score < 7
      GROUP BY law
      UNION ALL
      SELECT
        'Law 8: Faith-Driven' as law,
        COUNT(*) as count,
        AVG(law_8_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_8_score < 7
      GROUP BY law
      UNION ALL
      SELECT
        'Law 9: Legacy Focus' as law,
        COUNT(*) as count,
        AVG(law_9_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_9_score < 7
      GROUP BY law
      UNION ALL
      SELECT
        'Law 10: Excellence Standard' as law,
        COUNT(*) as count,
        AVG(law_10_score) as avg_score
      FROM vetting_results vr
      JOIN generated_content gc ON gc.id = vr.generated_content_id
      JOIN content_requests cr ON cr.id = gc.content_request_id
      WHERE cr.user_id = ${userId} AND vr.law_10_score < 7
      GROUP BY law
      ORDER BY avg_score ASC
      LIMIT 5
    `;

    return NextResponse.json({
      weekly_stats: weeklyStats,
      overall: {
        total_pieces: totalPieces,
        overall_approval_rate: overallApprovalRate,
        avg_score: avgScore,
        trend,
      },
      violations,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Mastery overview error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
