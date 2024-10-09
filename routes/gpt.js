import { pipeline } from '@xenova/transformers';
import Router from 'koa-router';  // 注意：直接导入默认导出
const router = new Router();

router.prefix('/gpt')

router.get('/', async function (ctx, next) {
  // Allocate a pipeline for sentiment-analysis
  let pipe = await pipeline('sentiment-analysis');

  let out = await pipe('I love transformers!');
  // [{'label': 'POSITIVE', 'score': 0.999817686}]
  ctx.body = out
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a gpt/bar response'
})

export default router
