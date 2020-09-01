import fp from 'fastify-plugin';
import Redis from 'ioredis';
import { nanoid } from 'nanoid';

const redis = fp((fastify, _, next) => {
  const instance = new Redis({
    keyPrefix: 'devpunk_',
  });

  const generateUserToken = async (id: string) => {
    const token = nanoid();
    await instance.set(`token_${token}`, id);
    return token;
  };

  const validateUserToken = async (id: string, token: string) => {
    const user = await instance.get(`token_${token}`);
    return user === id;
  };

  const destroyUserToken = (token: string) => {
    return instance.del(`token_${token}`);
  };

  fastify.decorate('redis', {
    generateUserToken,
    destroyUserToken,
    validateUserToken,
  });

  next();
});

export default redis;
