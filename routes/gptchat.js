import { HfInference } from "@huggingface/inference";
import Router from 'koa-router';
import User from '../models/user.js';
const router = new Router();

router.prefix('/chat')

const inference = new HfInference(process.env.HF_API_TOKEN);

async function query(messages, ctx) {
  ctx.set('Content-Type', 'text/plain; charset=utf-8');
  ctx.set('Transfer-Encoding', 'chunked');

  ctx.status = 200;
  ctx.res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked'
  });

  for await (const chunk of inference.chatCompletionStream({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages,
    max_tokens: 2048,
  })) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      ctx.res.write(content);
    }
  }

  ctx.res.end();
}

async function messagesGenerate(userInput, email) {
  const user = await User.findOne({ email });

  const userPrompt = `The question is:
  ${userInput}

  If the health information is: 
  ${user?.gender ? 'gender: ' + user?.gender + ';' : ''}
  ${user?.age ? 'age: ' + user?.age + ';' : ''}
  ${user?.height ? 'height: ' + user?.height + ';' : ''}
  ${user?.weight ? 'weight: ' + user?.weight + ';' : ''}
  ${user?.bloodPressure?.systolic ? 'bloodPressure(systolic): ' + user?.bloodPressure?.systolic + ';' : ''}
  ${user?.bloodPressure?.diastolic ? 'bloodPressure(diastolic): ' + user?.bloodPressure?.diastolic + ';' : ''}

  Please provide some health advice.`;

  // Set initial role prompt
  const messages = [
    {
      role: "system",
      content: "You are a professional virtual doctor at Ontario Tech University (OTU) providing health advice. Your name is OldSix. Please ensure to give accurate and practical recommendations."
    },
    {
      role: "user",
      content: email ? userPrompt : userInput
    }
  ];

  return messages
}

router.get('/', async function (ctx, next) {
  const userInput = ctx.query.message ?? 'hi'
  const email = ctx.query.email ?? ''
  const messages = await messagesGenerate(userInput, email)
  await query(messages, ctx)
})


async function healthLifeMessagesGenerate(email) {
  const user = await User.findOne({ email });

  const userPrompt = `
  If the health information is: 
  ${user?.gender ? 'Gender: ' + user?.gender + '; ' : ''}
  ${user?.age ? 'Age: ' + user?.age + '; ' : ''}
  ${user?.height ? 'Height: ' + user?.height + ' cm; ' : ''}
  ${user?.weight ? 'Weight: ' + user?.weight + ' kg; ' : ''}
  ${user?.bloodPressure?.systolic ? 'Blood Pressure (Systolic): ' + user?.bloodPressure?.systolic + ' mmHg; ' : ''}
  ${user?.bloodPressure?.diastolic ? 'Blood Pressure (Diastolic): ' + user?.bloodPressure?.diastolic + ' mmHg; ' : ''}
  
  Please provide a health advice in the following format:
  
  1. **Dietary Advice**: Provide specific suggestions for a healthy diet tailored to the user. Include recommended foods and any to avoid.
  
  2. **Fitness Plan**: Suggest a weekly fitness plan with activities (e.g., cardio, strength training, yoga), duration, and intensity suitable for the user.
  
  3. **Daily Routine Advice**: Offer guidance on an ideal daily schedule, including wake-up time, sleep time, work/study intervals, and breaks to improve overall well-being.
  `;

  // Initial messages for the chat model
  const messages = [
    {
      role: "system",
      content: `You are a virtual doctor. You should deliver accurate, practical, and personalized recommendations tailored to the provided health information. Format your advice into clear sections as requested.`
    },
    {
      role: "user",
      content: userPrompt
    }
  ];

  return messages;
}

router.get('/healthlife', async function (ctx, next) {
  const email = ctx.query.email ?? ''
  const messages = await healthLifeMessagesGenerate(email)
  await query(messages, ctx)
})

export default router
