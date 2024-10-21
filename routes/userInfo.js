import Router from 'koa-router';
import User from '../models/user.js';

const router = new Router();

router.prefix('/users')
// RESTful API

// create
router.post('/', async (ctx) => {
  try {
    // check if used
    const { email } = ctx.request.body
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      ctx.status = 409; // Conflict
      ctx.body = { message: 'Email already exists' };
      return;
    }

    const user = new User(ctx.request.body);
    const savedUser = await user.save();
    ctx.body = savedUser;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: 'Failed to create user', error: err.message };
  }
});

// get all
router.get('/', async (ctx) => {
  try {
    const users = await User.find({});
    ctx.body = users;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: 'Failed to fetch users', error: err.message };
  }
});

router.get('/:email', async (ctx) => {
  const { email } = ctx.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
      return;
    }
    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
});

// update
router.put('/:email', async (ctx) => {
  const { email } = ctx.params;
  try {
    const user = await User.findOneAndUpdate({ email }, ctx.request.body, { new: true, runValidators: true });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
      return;
    }
    ctx.body = user;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
});

router.delete('/:email', async (ctx) => {
  const { email } = ctx.params;
  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
      return;
    }
    ctx.status = 204; // No Content
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
});

export default router
