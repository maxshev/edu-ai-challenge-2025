import OpenAI from 'openai';

export async function summarizeTranscription(transcription: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional summarizer. Create a concise summary of the following transcription, highlighting the main points and key takeaways."
        },
        {
          role: "user",
          content: transcription
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || 'No summary generated';
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
} 