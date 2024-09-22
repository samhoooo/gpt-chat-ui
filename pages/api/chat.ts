import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

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

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "system",
        content: process.env.CHAT_PROMPT,
      },
      ...(body.messages.map((message) => ({
        role: message.role === "user" ? "user" : "assistant",
        content: message.content,
      })) as any),
    ],
    stream: true,
    presence_penalty: 1.2,
  });

  for await (const part of response) {
    if (part.choices[0]?.delta?.content)
      res.write(part.choices[0].delta.content);
  }

  res.end();
}
