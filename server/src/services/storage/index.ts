import fp from 'fastify-plugin';
import getLocalStoragePlugin from './local-storage';
import getS3StoragePlugin from './s3-storage';

const storage = fp((fastify, _, next) => {
  if (fastify.config.S3_BUCKET_NAME) {
    fastify.decorate('storage', getS3StoragePlugin(fastify));
  } else {
    fastify.decorate('storage', getLocalStoragePlugin(fastify));
  }

  next();
});

export default storage;
