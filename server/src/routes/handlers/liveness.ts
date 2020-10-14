import { FastifyPluginCallback } from 'fastify';

const STATUS_500 = 500;

const metricsHandler: FastifyPluginCallback<Record<string, unknown>> = (
  fastify,
  _,
  next
) => {
  fastify.get('/live', async (__, res) => {
    try {
      const status = await Promise.all([
        fastify.db.ping(),
        fastify.redis.ping()
      ]);

      if (status.every(Boolean)) {
        res.send({
          message: 'Server can hear you loud and clear',
          success: true
        });
      } else {
        const [dbController, redisInstance] = status;

        res.send({
          message: 'Server has some issue hearing you',
          meta: {
            dbController,
            redisInstance
          },
          success: true
        });
      }
    } catch (e) {
      res.status(STATUS_500).send({
        message: e.message,
        stack: e.stack,
        success: false
      });
    }
  });

  fastify.get('/ready', (__, res) => {
    res.send({
      message: 'Server is ready to server you toasty feeds',
      success: true
    });
  });

  next();
};

export default metricsHandler;
