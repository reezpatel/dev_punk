import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { IWebsite, IFeeds, IUser } from 'src/types/database';
import DBController from './controller';
import { WebsiteSchema, FeedsSchema, UserSchema } from './schema';

const getConnectionString = ({
  MONGODB_PASSWORD,
  MONGODB_USERNAME,
  MONGODB_DB_NAME,
  MONGODB_AUTH_DB,
  MONGODB_HOST,
  MONGODB_PORT
}) =>
  `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}` +
  `@${MONGODB_HOST}:${MONGODB_PORT}` +
  `/${MONGODB_DB_NAME}?authSource=${MONGODB_AUTH_DB}`;

const CONNECTION_OPTION: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const controller = new DBController();

controller.setWebsiteInstance(
  mongoose.model<IWebsite>('website', WebsiteSchema)
);
controller.setFeedsInstance(mongoose.model<IFeeds>('feeds', FeedsSchema));
controller.setUserInstance(mongoose.model<IUser>('users', UserSchema));

const database = fp(async (fastify, _, next) => {
  try {
    await mongoose.connect(
      getConnectionString(fastify.config),
      CONNECTION_OPTION
    );

    fastify.log.info('Successfully connected to DB');
    controller.setLogger(fastify.log);
    fastify.decorate('db', controller);
  } catch (e) {
    fastify.log.error({
      error: 'Failed to initialize DB connection',
      message: e.message,
      stack: e.stack
    });
  }

  next();
});

export default database;
