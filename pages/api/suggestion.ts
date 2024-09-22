import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

type RequestBody = {
  messages: { role: string; content: string }[];
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  const body: RequestBody = req.body;

  const suggestedQuestions = z.object({
    relatedQuestions: z.array(z.string()),
  });

  const suggestedQuestionsResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "system",
        content: `Based on the conversations, suggest 1 to 3 related questions that could be asked about. 
        Keey your questions concise and to the point. 
        Remember to use simple language and avoid complex vocabulary.
        If you response in Chinese, use only traditional Chinese characters.
        `,
      },
      ...(body.messages.map((message) => ({
        role: message.role === "user" ? "user" : "assistant",
        content: message.content,
      })) as any),
    ],
    response_format: zodResponseFormat(
      suggestedQuestions,
      "suggested_questions"
    ),
    stream: false,
  });

  res.json(
    JSON.parse(suggestedQuestionsResponse.choices[0].message.content ?? "")
  );
}
