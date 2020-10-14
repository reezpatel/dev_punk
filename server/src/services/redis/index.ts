import fp from 'fastify-plugin';
import Redis from 'ioredis';
import { nanoid } from 'nanoid';

type destroyUserToken = (token: string) => Promise<number>;
type generateUserToken = (id: string) => Promise<string>;
type validateUserToken = (id: string, token: string) => Promise<boolean>;

interface RedisService {
  destroyUserToken: destroyUserToken;
  generateUserToken: generateUserToken;
  validateUserToken: validateUserToken;
  ping: () => Promise<boolean>;
}

const generateUserToken: (instance: Redis.Redis) => generateUserToken = (
  instance
) => async (id) => {
  const token = nanoid();

  await instance.set(`token_${token}`, id);

  return token;
};

const validateUserToken: (instance: Redis.Redis) => validateUserToken = (
  instance
) => async (id, token) => {
  const user = await instance.get(`token_${token}`);

  return user === id;
};

const destroyUserToken: (instance: Redis.Redis) => destroyUserToken = (
  instance
) => (token) => instance.del(`token_${token}`);

const redis = fp((fastify, _, next) => {
  const instance = new Redis({
    host: fastify.config.REDIS_HOST,
    keyPrefix: 'devpunk_'
  });

  fastify.decorate('redis', {
    destroyUserToken: destroyUserToken(instance),
    generateUserToken: generateUserToken(instance),
    ping: () => {
      if (instance.status !== 'ready') {
        fastify.log.error({
          message: 'Redis connection is down',
          meta: {
            status: instance.status
          },
          module: 'DBController'
        });

        return Promise.resolve(false);
      }

      return Promise.resolve(true);
    },
    validateUserToken: validateUserToken(instance)
  });

  next();
});

export default redis;
export { RedisService };
