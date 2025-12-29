import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    const checks: any = {
      timestamp: new Date().toISOString(),
      environment: {},
      database: {},
      anthropic: {},
    };

    // Check 1: Environment variables
    checks.environment.DATABASE_URL = !!process.env.DATABASE_URL ? '✅ Set' : '❌ Not set';
    checks.environment.ANTHROPIC_API_KEY = !!process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Not set';
    checks.environment.JWT_SECRET = !!process.env.JWT_SECRET ? '✅ Set' : '❌ Not set';

    if (!process.env.DATABASE_URL) {
      checks.status = '❌ DATABASE_URL not configured';
      return NextResponse.json(checks, { status: 500 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      checks.status = '⚠️ ANTHROPIC_API_KEY not configured - content generation will fail';
      checks.anthropic.error = 'Add ANTHROPIC_API_KEY to Vercel environment variables';
      return NextResponse.json(checks, { status: 200 });
    }

    // Check 2: Database connection
    try {
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
      checks.database.connection = '✅ Connected';
      checks.database.server_time = result[0].current_time;
      checks.database.postgres_version = result[0].pg_version.split(' ')[0] + ' ' + result[0].pg_version.split(' ')[1];
    } catch (dbError: any) {
      checks.database.connection = '❌ Failed';
      checks.database.error = dbError.message;
      checks.status = '❌ Database connection failed';
      return NextResponse.json(checks, { status: 500 });
    }

    // Check 3: Database tables
    try {
      const sql = neon(process.env.DATABASE_URL);
      const tables = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      checks.database.tables = tables.map((t: any) => t.table_name);
      checks.database.table_count = tables.length;

      const expectedTables = [
        'users',
        'content_requests',
        'generated_content',
        'vetting_results',
        'published_content',
        'mastery_tracking',
        'constitutional_law',
        'four_e_balance',
      ];

      const missingTables = expectedTables.filter(
        (t) => !checks.database.tables.includes(t)
      );

      if (missingTables.length > 0) {
        checks.database.missing_tables = missingTables;
        checks.database.status = `⚠️ Missing ${missingTables.length} tables`;
        checks.database.fix = 'Run database/schema.sql in Neon SQL Editor';
      } else {
        checks.database.status = '✅ All 8 tables exist';
      }
    } catch (tableError: any) {
      checks.database.tables_error = tableError.message;
    }

    // Check 4: Anthropic API key format
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      checks.anthropic.key_format = apiKey.startsWith('sk-ant-') ? '✅ Valid format' : '⚠️ Invalid format (should start with sk-ant-)';
      checks.anthropic.key_length = apiKey.length;
    }

    // Check 5: Content requests count
    try {
      const sql = neon(process.env.DATABASE_URL);
      const count = await sql`SELECT COUNT(*) as count FROM content_requests`;
      checks.database.content_count = parseInt(count[0].count);
    } catch (e) {
      checks.database.content_count = 'Unable to fetch';
    }

    // Overall status
    if (checks.database.missing_tables && checks.database.missing_tables.length > 0) {
      checks.status = '⚠️ Database tables need setup';
    } else if (!process.env.ANTHROPIC_API_KEY) {
      checks.status = '⚠️ Anthropic API key needed for content generation';
    } else {
      checks.status = '✅ All systems operational';
    }

    return NextResponse.json(checks, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      {
        status: '❌ System check failed',
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
