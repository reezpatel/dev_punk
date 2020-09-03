import fp from 'fastify-plugin';

const metricsHandler = fp((fastify, _, next) => {
  fastify.get('/live', (__, res) => {
    res.send({ message: 'Server can hear you loud and clear', success: true });
  });

  fastify.get('/ready', (__, res) => {
    res.send({
      message: 'Server is ready to server you toasty feeds',
      success: true
    });
  });

  fastify.get('/metrics', (__, res) => {
    res.send({
      message: "Server doesn't have any metrics yet",
      success: false
    });
  });

  next();
});

export default metricsHandler;
