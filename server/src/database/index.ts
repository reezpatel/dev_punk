import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import {
  WebsiteSchema,
  FeedsSchema,
  UserSchema,
  IWebsite,
  IFeeds,
  IUser,
} from './schema';
import DBController from './controller';

const getConnectionString = ({
  MONGODB_PASSWORD: pwd,
  MONGODB_USERNAME: u,
  MONGODB_DB_NAME: db,
  MONGODB_AUTH_DB: auth_db,
  MONGODB_HOST: h,
  MONGODB_PORT: p,
}) => `mongodb://${u}:${pwd}@${h}:${p}/${db}?authSource=${auth_db}`;

const database = fp(async (fastify, _, next) => {
  try {
    await mongoose.connect(getConnectionString(fastify.config), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    fastify.log.info('Successfully connected to DB');

    const Websites = mongoose.model<IWebsite>('website', WebsiteSchema);
    const Feeds = mongoose.model<IFeeds>('feeds', FeedsSchema);
    const Users = mongoose.model<IUser>('users', UserSchema);

    const controller = new DBController(Websites, Feeds, Users, fastify.log);

    fastify.decorate('db', controller);
  } catch (e) {
    fastify.log.error({
      error: 'Failed to initialize DB connection',
      message: e.message,
      stack: e.stack,
    });
  }

  next();
});

export default database;
