import { pipeline } from '@xenova/transformers';
import Router from 'koa-router';
const router = new Router();

router.prefix('/gpt')

router.get('/', async function (ctx, next) {
  const model = await pipeline('text-generation', 'Xenova/gpt2');
  const response = await model('What is the capital of France?');
  ctx.body = response
})

export default router
