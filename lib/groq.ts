/**
 * GROQ AI Client wrapper for easier integration
 */

import Groq from 'groq-sdk';

let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GROQ_API_KEY is not set');
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export async function generateWorkflowSteps(
  userInput: string,
  context?: string
): Promise<string> {
  const client = getGroqClient();

  const message = await client.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    max_tokens: 2048,
    messages: [
      {
        role: 'user' as const,
        content: `You are an expert workflow automation specialist. Based on the following input, generate a structured workflow with clear steps. 
        
User Input: ${userInput}
${context ? `Context/Documents: ${context}` : ''}

Please provide the response in JSON format with the following structure:
{
  "workflowName": "string",
  "description": "string",
  "steps": [
    {
      "id": "step_1",
      "name": "string",
      "description": "string",
      "type": "input|process|decision|output|ai",
      "aiPrompt": "optional AI prompt if type is 'ai'"
    }
  ]
}`,
      },
    ],
  });

  const responseText =
    message.choices[0]?.message?.content || '';
  return responseText;
}

export async function chatWithAI(
  userMessage: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<string> {
  const client = getGroqClient();

  const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
    {
      role: 'system',
      content: `You are a helpful AI assistant specializing in workflow automation and business process management. 
You help users create, understand, and optimize their automated workflows. Be concise, clear, and professional.`,
    },
    ...(conversationHistory || []).map((msg) => {
      const role = msg.role === 'user' ? 'user' : 'assistant';
      return {
        role: role as 'user' | 'assistant',
        content: msg.content,
      };
    }),
    {
      role: 'user' as const,
      content: userMessage,
    },
  ];

  const response = await client.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    max_tokens: 1024,
    messages: messages as any,
  });

  const responseText =
    response.choices[0]?.message?.content || '';
  return responseText;
}

export async function analyzeDocument(
  documentContent: string,
  analysisType: 'summary' | 'extract' | 'categorize' = 'summary'
): Promise<string> {
  const client = getGroqClient();

  const prompts: Record<string, string> = {
    summary: `Provide a concise summary of the following document in 2-3 paragraphs:`,
    extract: `Extract key information (entities, dates, amounts, actions) from the following document. Format as a structured list:`,
    categorize: `Analyze and categorize the following document. Identify the document type, key sections, and important details:`,
  };

  const message = await client.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    max_tokens: 1024,
    messages: [
      {
        role: 'user' as const,
        content: `${prompts[analysisType]}\n\n${documentContent}`,
      },
    ],
  });

  const responseText =
    message.choices[0]?.message?.content || '';
  return responseText;
}

export async function generateWorkflowName(
  description: string
): Promise<string> {
  const client = getGroqClient();

  const message = await client.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    max_tokens: 100,
    messages: [
      {
        role: 'user' as const,
        content: `Generate a short, descriptive workflow name (max 5 words) for this workflow: ${description}. 
Return only the name, no quotes or extra text.`,
      },
    ],
  });

  const responseText =
    message.choices[0]?.message?.content || '';
  return responseText.trim();
}
