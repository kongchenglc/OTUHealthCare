import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const jwtAuth = async (ctx, next) => {
  const token = ctx.headers['authorization']?.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Authorization token is missing' };
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    ctx.state.user = user;
    await next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: 'Invalid or expired token' };
  }
};
