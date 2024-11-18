import { expect } from 'chai';
import request from 'supertest';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import sinon from 'sinon';
import User from '../models/user.js';
import userRoutes from '../routes/userInfo.js';

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(userRoutes.routes());

let server;
before(() => {
  server = app.listen();
});
afterEach(() => {
  sinon.restore();
});
after(() => {
  server.close();
});

describe('GET /user/all/', () => {
  it('should return all users successfully', async () => {
    const mockUsers = [{ username: 'testUser', email: 'test@example.com' }];

    sinon.stub(User, 'find').resolves(mockUsers);

    const res = await request(server).get('/user/all/');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockUsers);
  });

  it('should handle error when fetching users', async () => {

    sinon.stub(User, 'find').throws(new Error('Database error'));

    const res = await request(server).get('/user/all/');

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Failed to fetch users');
  });
});
