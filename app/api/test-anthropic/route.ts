import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function GET(request: NextRequest) {
  try {
    const result: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Test 1: API key present
    result.tests.apiKeyPresent = !!process.env.ANTHROPIC_API_KEY ? '✅ Present' : '❌ Missing';

    if (!process.env.ANTHROPIC_API_KEY) {
      result.status = '❌ ANTHROPIC_API_KEY not set';
      return NextResponse.json(result, { status: 500 });
    }

    // Test 2: API key format
    const key = process.env.ANTHROPIC_API_KEY;
    result.tests.apiKeyFormat = key.startsWith('sk-ant-') ? '✅ Valid format' : '❌ Invalid format';
    result.tests.apiKeyLength = key.length;

    // Test 3: Create Anthropic client
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      result.tests.clientCreation = '✅ Client created successfully';
    } catch (clientError: any) {
      result.tests.clientCreation = `❌ Failed: ${clientError.message}`;
      result.status = '❌ Failed to create Anthropic client';
      return NextResponse.json(result, { status: 500 });
    }

    // Test 4: Make a simple API call
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Say "Hello from NOCHILL!" in exactly those words.',
          },
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
      result.tests.apiCall = '✅ API call successful';
      result.tests.apiResponse = responseText;
      result.tests.modelUsed = message.model;
      result.tests.tokensUsed = {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
      };
    } catch (apiError: any) {
      result.tests.apiCall = `❌ Failed: ${apiError.message}`;
      result.tests.errorDetails = {
        type: apiError.constructor.name,
        status: apiError.status,
        error: apiError.error,
      };
      result.status = '❌ Anthropic API call failed';
      return NextResponse.json(result, { status: 500 });
    }

    result.status = '✅ All Anthropic API tests passed!';
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      {
        status: '❌ Test failed',
        error: error.message,
        errorType: error.constructor.name,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
