import OpenAI from 'openai';
const client = new OpenAI({
  apiKey:
    '',
  dangerouslyAllowBrowser: true,
  maxRetries: 0,
});

export async function getChatResponse(prompt: string) {
  const response = await client.responses.create({
    model: 'gpt-4.1',
    input: prompt,
  });
  return response;
}
