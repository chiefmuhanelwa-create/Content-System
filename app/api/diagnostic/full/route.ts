import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import Anthropic from '@anthropic-ai/sdk';
import { FOUNDATION_PROMPT, GENERATION_ENGINE_PROMPT } from '@/lib/prompts';

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
    summary: { passed: 0, failed: 0 }
  };

  try {
    // TEST 1: Environment Variables
    console.log('=== TEST 1: Environment Variables ===');
    results.tests.env = {
      DATABASE_URL: !!process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing',
      JWT_SECRET: !!process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
    };

    if (!process.env.DATABASE_URL || !process.env.ANTHROPIC_API_KEY) {
      results.tests.env.status = '❌ FAILED';
      results.summary.failed++;
      results.error = 'Missing required environment variables';
      return NextResponse.json(results, { status: 500 });
    }
    results.tests.env.status = '✅ PASSED';
    results.summary.passed++;

    // TEST 2: Database Connection
    console.log('=== TEST 2: Database Connection ===');
    const sql = neon(process.env.DATABASE_URL);

    try {
      const dbTest = await sql`SELECT NOW() as time`;
      results.tests.database_connection = {
        status: '✅ PASSED',
        server_time: dbTest[0].time
      };
      results.summary.passed++;
    } catch (dbError: any) {
      results.tests.database_connection = {
        status: '❌ FAILED',
        error: dbError.message
      };
      results.summary.failed++;
      return NextResponse.json(results, { status: 500 });
    }

    // TEST 3: Database Tables
    console.log('=== TEST 3: Database Tables ===');
    try {
      const tables = await sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name
      `;
      const tableNames = tables.map((t: any) => t.table_name);
      const required = ['users', 'content_requests', 'generated_content', 'vetting_results'];
      const missing = required.filter(t => !tableNames.includes(t));

      results.tests.database_tables = {
        status: missing.length === 0 ? '✅ PASSED' : '❌ FAILED',
        found: tableNames,
        missing: missing
      };

      if (missing.length > 0) {
        results.summary.failed++;
        return NextResponse.json(results, { status: 500 });
      }
      results.summary.passed++;
    } catch (tableError: any) {
      results.tests.database_tables = {
        status: '❌ FAILED',
        error: tableError.message
      };
      results.summary.failed++;
      return NextResponse.json(results, { status: 500 });
    }

    // TEST 4: Anthropic API - Simple Call
    console.log('=== TEST 4: Anthropic API - Simple Call ===');
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Say "OK" only.' }]
      });

      const response = message.content[0].type === 'text' ? message.content[0].text : '';

      results.tests.anthropic_simple = {
        status: '✅ PASSED',
        model: message.model,
        response: response,
        tokens: message.usage
      };
      results.summary.passed++;
    } catch (anthropicError: any) {
      results.tests.anthropic_simple = {
        status: '❌ FAILED',
        error: anthropicError.message,
        type: anthropicError.constructor.name,
        details: anthropicError.error || anthropicError.status
      };
      results.summary.failed++;
      return NextResponse.json(results, { status: 500 });
    }

    // TEST 5: Anthropic API - With System Prompt
    console.log('=== TEST 5: Anthropic API - With System Prompt ===');
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const testSystemPrompt = FOUNDATION_PROMPT.substring(0, 500); // Use subset to avoid size issues

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 100,
        system: testSystemPrompt,
        messages: [{ role: 'user', content: 'Write one sentence about content creation.' }]
      });

      const response = message.content[0].type === 'text' ? message.content[0].text : '';

      results.tests.anthropic_system_prompt = {
        status: '✅ PASSED',
        response_length: response.length,
        tokens: message.usage
      };
      results.summary.passed++;
    } catch (systemError: any) {
      results.tests.anthropic_system_prompt = {
        status: '❌ FAILED',
        error: systemError.message,
        type: systemError.constructor.name
      };
      results.summary.failed++;
      return NextResponse.json(results, { status: 500 });
    }

    // TEST 6: Database Write
    console.log('=== TEST 6: Database Write ===');
    try {
      // Create a test content request
      const testInsert = await sql`
        INSERT INTO content_requests (
          user_id, content_intent, paids_stream, seeds_stage,
          content_type, platform, content_pillar, laws_upheld,
          pain_point, desired_outcome, cta_next_step, product_tier,
          framework_reference, status
        ) VALUES (
          1, 'Educate', ARRAY['Information'], 'Education',
          'Short-form', ARRAY['X (Twitter)'], 'Creator Business', ARRAY['Law 1: Africa First'],
          'Platform Dependency', 'Financial Freedom', 'Test CTA', 'Free',
          'Test Framework', 'pending'
        )
        RETURNING id
      `;

      const testId = testInsert[0].id;

      // Clean up test data
      await sql`DELETE FROM content_requests WHERE id = ${testId}`;

      results.tests.database_write = {
        status: '✅ PASSED',
        test_id: testId
      };
      results.summary.passed++;
    } catch (writeError: any) {
      results.tests.database_write = {
        status: '❌ FAILED',
        error: writeError.message
      };
      results.summary.failed++;
    }

    // TEST 7: Full Generation Flow (Mock)
    console.log('=== TEST 7: Full Generation Flow ===');
    try {
      // Create test request
      const testRequest = await sql`
        INSERT INTO content_requests (
          user_id, content_intent, paids_stream, seeds_stage,
          content_type, platform, content_pillar, laws_upheld,
          pain_point, desired_outcome, cta_next_step, product_tier,
          framework_reference, status
        ) VALUES (
          1, 'Educate', ARRAY['Information'], 'Education',
          'Short-form', ARRAY['X (Twitter)'], 'Creator Business', ARRAY['Law 1: Africa First'],
          'Platform Dependency', 'Financial Freedom', 'Download guide', 'Free',
          'Hook-Story-Offer', 'pending'
        )
        RETURNING id
      `;

      const requestId = testRequest[0].id;

      // Generate content with Anthropic
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const genMessage = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 500,
        system: FOUNDATION_PROMPT.substring(0, 1000) + '\n\n' + GENERATION_ENGINE_PROMPT.substring(0, 1000),
        messages: [{
          role: 'user',
          content: 'Create a short tweet about content ownership for creators. Include a call to action.'
        }]
      });

      const generatedText = genMessage.content[0].type === 'text' ? genMessage.content[0].text : '';

      // Save generated content
      const savedContent = await sql`
        INSERT INTO generated_content (
          content_request_id, content_text, word_count
        ) VALUES (
          ${requestId}, ${generatedText}, ${generatedText.split(/\s+/).length}
        )
        RETURNING id
      `;

      // Clean up
      await sql`DELETE FROM generated_content WHERE id = ${savedContent[0].id}`;
      await sql`DELETE FROM content_requests WHERE id = ${requestId}`;

      results.tests.full_flow = {
        status: '✅ PASSED',
        generated_length: generatedText.length,
        tokens_used: genMessage.usage
      };
      results.summary.passed++;
    } catch (flowError: any) {
      results.tests.full_flow = {
        status: '❌ FAILED',
        error: flowError.message,
        type: flowError.constructor.name
      };
      results.summary.failed++;
    }

    // FINAL SUMMARY
    results.overall_status = results.summary.failed === 0 ? '✅ ALL TESTS PASSED' : `❌ ${results.summary.failed} TESTS FAILED`;
    results.ready_for_production = results.summary.failed === 0;

    if (results.summary.failed === 0) {
      results.next_steps = 'System is ready! Try creating content through the UI.';
    } else {
      results.next_steps = 'Fix the failed tests above before proceeding.';
    }

    return NextResponse.json(results, { status: results.summary.failed === 0 ? 200 : 500 });

  } catch (error: any) {
    return NextResponse.json({
      status: '❌ DIAGNOSTIC FAILED',
      error: error.message,
      stack: error.stack,
      tests: results.tests
    }, { status: 500 });
  }
}
