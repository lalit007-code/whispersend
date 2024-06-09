// import OpenAI from "openai";
// import { OpenAIStream, StreamingTextResponse } from "ai";

// //create and openAI client (that'edge freindly)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// //set the runtiime to edge for best performance
// export const runtiime = "edge";

// export async function POST(request: Request) {
//   const { messages } = await request.json();

//   //ask openAI for a streaming chat comletion given the prompt

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     stream: true,
//     messages,
//   });

//   //comvert the response into a friendly text-stream
//   const stream = OpenAIStream(response);
// }

//will complete this route in future , out of pocket right now