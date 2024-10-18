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
const router = new Router();

const inference = new HfInference("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");

async function query(userInput) {
  let result = ''
  for await (const chunk of inference.chatCompletionStream({
    model: "meta-llama/Llama-3.2-1B-Instruct",
    messages: [{ role: "user", content: userInput }],
    max_tokens: 500,
  })) {
    console.log(chunk.choices[0]?.delta)
    result += chunk.choices[0]?.delta?.content || ""
  }
  return result;
}

router.prefix('/gptchat')

router.get('/', async function (ctx, next) {
  const userInput = ctx.query.message ?? 'hi'
  const response = await query(userInput)
  ctx.body = response
})

export default router
