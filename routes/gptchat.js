// import { pipeline } from '@xenova/transformers';
// import Router from 'koa-router';
// const router = new Router();

// router.prefix('/gptchat')

// router.get('/', async function (ctx, next) {
//   const userInput = ctx.query.message
//   const model = await pipeline('text-generation', 'Xenova/gpt2');
//   const response = await model(userInput || 'Input Nothing');
//   ctx.body = response?.[0]?.generated_text
// })

// export default router

import { HfInference } from "@huggingface/inference";
import Router from 'koa-router';
import User from '../models/user.js';
const router = new Router();

const inference = new HfInference(process.env.HF_API_TOKEN);

async function query(userInput, email) {
  let result = ''
  const user = await User.findOne({ email });

  const userPrompt = `User's question is:
  ${userInput}.

  Here is the user's information: 
  ${user?.gender ? 'gender:' + user?.gender : ''};
  ${user?.age ? 'age:' + user?.age : ''};
  ${user?.height ? 'height:' + user?.height : ''};
  ${user?.weight ? 'weight:' + user?.weight : ''};
  ${user?.bloodPressure?.systolic ? 'bloodPressure(systolic):' + user?.bloodPressure?.systolic : ''};
  ${user?.bloodPressure?.diastolic ? 'bloodPressure(diastolic):' + user?.bloodPressure?.diastolic : ''};

  Based on this information, please provide health advice.`;

  // Set initial role prompt
  const messages = [
    {
      role: "system",
      content: "You are a professional virtual doctor at Ontario Tech University (OTU) providing health advice. Your name is OldSix. Please ensure to give accurate and practical recommendations."
    },
    {
      role: "user",
      content: userPrompt
    }
  ];
  for await (const chunk of inference.chatCompletionStream({
    model: "meta-llama/Llama-3.2-1B-Instruct",
    messages,
    max_tokens: 500,
  })) {
    result += chunk.choices[0]?.delta?.content || ""
  }
  return result;
}

router.prefix('/chat')

router.get('/', async function (ctx, next) {
  const userInput = ctx.query.message ?? 'hi'
  const userEmail = ctx.query.email ?? ''
  const response = await query(userInput, userEmail)
  ctx.body = response
})

export default router
