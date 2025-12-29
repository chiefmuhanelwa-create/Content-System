import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // Check 1: Environment variable exists
    results.checks.env_variable = {
      status: !!process.env.DATABASE_URL ? 'PASS' : 'FAIL',
      value: process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET'
    };

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(results, { status: 500 });
    }

    // Check 2: Database connection
    const sql = neon(process.env.DATABASE_URL);

    try {
      const connectionTest = await sql`SELECT NOW() as current_time`;
      results.checks.db_connection = {
        status: 'PASS',
        current_time: connectionTest[0].current_time
      };
    } catch (error: any) {
      results.checks.db_connection = {
        status: 'FAIL',
        error: error.message
      };
      return NextResponse.json(results, { status: 500 });
    }

    // Check 3: Users table exists
    try {
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'users'
        ) as exists
      `;
      results.checks.users_table = {
        status: tableCheck[0].exists ? 'PASS' : 'FAIL',
        exists: tableCheck[0].exists
      };

      if (!tableCheck[0].exists) {
        results.checks.users_table.message = 'Run database/schema.sql in Neon SQL Editor';
        return NextResponse.json(results, { status: 500 });
      }
    } catch (error: any) {
      results.checks.users_table = {
        status: 'FAIL',
        error: error.message
      };
      return NextResponse.json(results, { status: 500 });
    }

    // Check 4: Demo user exists
    try {
      const userCheck = await sql`
        SELECT id, email, full_name,
               LEFT(password_hash, 10) as hash_preview,
               LENGTH(password_hash) as hash_length
        FROM users
        WHERE email = 'demo@nochill.co.za'
      `;

      results.checks.demo_user = {
        status: userCheck.length > 0 ? 'PASS' : 'FAIL',
        exists: userCheck.length > 0,
        user: userCheck.length > 0 ? {
          id: userCheck[0].id,
          email: userCheck[0].email,
          full_name: userCheck[0].full_name,
          hash_preview: userCheck[0].hash_preview,
          hash_length: userCheck[0].hash_length
        } : null
      };

      if (userCheck.length === 0) {
        results.checks.demo_user.message = 'Run create-demo-user.sql in Neon SQL Editor';
        return NextResponse.json(results, { status: 500 });
      }
    } catch (error: any) {
      results.checks.demo_user = {
        status: 'FAIL',
        error: error.message
      };
      return NextResponse.json(results, { status: 500 });
    }

    // Check 5: All tables exist
    try {
      const allTables = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      results.checks.all_tables = {
        status: 'INFO',
        count: allTables.length,
        tables: allTables.map((t: any) => t.table_name)
      };
    } catch (error: any) {
      results.checks.all_tables = {
        status: 'ERROR',
        error: error.message
      };
    }

    results.overall_status = 'ALL CHECKS PASSED ✅';
    results.message = 'Database is configured correctly. Login should work with: demo@nochill.co.za / nochill2024';

    return NextResponse.json(results, { status: 200 });

  } catch (error: any) {
    results.checks.unexpected_error = {
      status: 'FAIL',
      error: error.message,
      stack: error.stack
    };
    return NextResponse.json(results, { status: 500 });
  }
}
