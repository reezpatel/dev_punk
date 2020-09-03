import fp from 'fastify-plugin';

const REDIRECT_RESPONSE_CODE = 307;

const redirectHandler = fp((fastify, _, next) => {
  fastify.get<{ Params: { id: string } }>('/:id', async (req, res) => {
    const url = await fastify.db.getFeedUrl(req.params.id);

    res.redirect(REDIRECT_RESPONSE_CODE, url || fastify.config.APPLICATION_URL);
  });

  next();
});

export default redirectHandler;
