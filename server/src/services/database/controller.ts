import mongoose, { Model } from 'mongoose';
import { FastifyLoggerInstance } from 'fastify';
import { Website, Feeds } from '@devpunk/types';
import {
  IWebsite,
  IFeeds,
  IUser,
  ErrorResponse,
  SuccessResponse,
  MongooseError
} from 'src/types/database';

const RPP = 30;
const DELTA = 1;
const DELETE_COUNT = 1;
const FIRST_INDEX = 0;
const MAX_QUERY_LENGTH = 25;

class DBController {
  private Websites: Model<IWebsite, Record<string, unknown>>;

  private Feeds: Model<IFeeds, Record<string, unknown>>;

  private Users: Model<IUser, Record<string, unknown>>;

  private logger: FastifyLoggerInstance;

  private handleError(e: Error | MongooseError) {
    this.logger.error({
      message: e.message,
      module: 'DBController',
      stack: e.stack
    });

    if (!(e instanceof Error)) {
      return {
        error: Object.values(e.errors)[FIRST_INDEX].message
      };
    }

    return {
      error: e.message
    };
  }

  setWebsiteInstance(website: Model<IWebsite, Record<string, unknown>>): void {
    this.Websites = website;
  }

  setFeedsInstance(feeds: Model<IFeeds, Record<string, unknown>>): void {
    this.Feeds = feeds;
  }

  setUserInstance(user: Model<IUser, Record<string, unknown>>): void {
    this.Users = user;
  }

  setLogger(logger: FastifyLoggerInstance): void {
    this.logger = logger;
  }

  async getAllWebsites(): Promise<IWebsite[] | ErrorResponse> {
    try {
      const websites = await this.Websites.find().sort({ name: 1, order: -1 });

      return websites;
    } catch (e) {
      return this.handleError(e);
    }
  }

  ping(): Promise<boolean> {
    const status = mongoose.STATES[mongoose.connection.readyState];

    if (status === 'connected') {
      return Promise.resolve(true);
    }

    this.logger.error({
      message: 'DB connection is down',
      meta: {
        status
      },
      module: 'DBController'
    });

    return Promise.resolve(false);
  }

  async addNewWebsite(website: Website): Promise<Website | ErrorResponse> {
    try {
      const doc = await this.Websites.findOne({ feed: website.feed });

      if (doc) {
        return {
          error: `Website ${doc.name} already exist for provided feed`
        };
      }

      await new this.Websites({
        _id: new mongoose.Types.ObjectId(),
        ...website
      }).save();

      return {
        _id: new mongoose.Types.ObjectId(),
        ...website
      };
    } catch (e) {
      return this.handleError(e);
    }
  }

  async editWebsite(website: Website): Promise<IWebsite | ErrorResponse> {
    try {
      const doc = await this.Websites.findOne({ _id: website._id });

      if (!doc) {
        return {
          error: "Website doesn't exist"
        };
      }
      await this.Websites.updateOne(
        { _id: website._id },
        { ...website, order: `${website.order}` }
      );

      return this.Websites.findOne({ _id: website._id });
    } catch (e) {
      return this.handleError(e);
    }
  }

  async addFeeds(feeds: Feeds[]): Promise<IFeeds[]> {
    const docs: IFeeds[] = await this.Feeds.where('url').in(
      feeds.map((feed) => feed.url)
    );

    const urls = {};

    docs.forEach((doc) => {
      urls[doc.url] = true;
    });

    try {
      const insertableFeed = feeds.filter((feed) => !urls[feed.url]);

      return this.Feeds.insertMany(insertableFeed, {
        ordered: true,
        rawResult: false
      });
    } catch (e) {
      this.handleError(e);

      return [];
    }
  }

  async getFeeds(
    page: number,
    website: string,
    search: string
  ): Promise<IFeeds[] | ErrorResponse> {
    try {
      const query: Record<string, unknown> = {};

      if (website) {
        query.website = website;
      }

      if (search && search.length < MAX_QUERY_LENGTH) {
        query.title = { $regex: search };
      }

      return await this.Feeds.find(query)
        .sort({ publishedAt: -1 })
        .limit(RPP)
        .skip((page - DELTA) * RPP);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async getFeedsWithoutImage(page: number): Promise<IFeeds[] | ErrorResponse> {
    try {
      return await this.Feeds.find({ image: '' })
        .sort({ publishedAt: -1 })
        .limit(RPP)
        .skip((page - DELTA) * RPP);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async addImageToFeed(
    id: string,
    image: string
  ): Promise<boolean | ErrorResponse> {
    try {
      const feed = await this.Feeds.findOne({ _id: id });

      feed.image = image;

      await this.Feeds.updateOne({ _id: id }, feed);

      return true;
    } catch (e) {
      return this.handleError(e);
    }
  }

  async resolveFeedsToWebsite(feeds: IFeeds[]): Promise<Website[]> {
    const ids = feeds.map(
      ({ website }) => new mongoose.Types.ObjectId(website)
    );

    const websites = await this.Websites.where('_id').in(ids);
    const mapping: Record<string, Website> = {};

    websites.forEach((website) => {
      mapping[website._id] = website;
    });

    return ids.map((id) => mapping[`${id}`]);
  }

  async resolveFavorites(favorites: string[]): Promise<Feeds[]> {
    const ids = favorites.map((id) => new mongoose.Types.ObjectId(id));
    const feeds = await this.Feeds.where('_id').in(ids);
    const mapping: Record<string, Feeds> = {};

    feeds.forEach((website) => {
      mapping[website._id] = website;
    });

    return ids.map((id) => mapping[`${id}`]);
  }

  async resolvePins(pins: string[]): Promise<Website[]> {
    const ids = pins.map((id) => new mongoose.Types.ObjectId(id));
    const websites = await this.Websites.where('_id').in(ids);
    const mapping: Record<string, Website> = {};

    websites.forEach((website) => {
      mapping[website._id] = website;
    });

    return ids.map((id) => mapping[`${id}`]);
  }

  async updateFavorites(
    id: string,
    feeds: string[]
  ): Promise<IUser | ErrorResponse> {
    try {
      const user = await this.Users.findOne({ _id: id });

      if (!user) {
        throw new Error("User doesn't exist");
      }

      user.favorites = feeds;
      await this.Users.updateOne({ _id: id }, user);

      return user;
    } catch (e) {
      return this.handleError(e);
    }
  }

  async updatePins(
    id: string,
    website: string[]
  ): Promise<IUser | ErrorResponse> {
    try {
      const user = await this.Users.findOne({ _id: id });

      if (!user) {
        throw new Error("User doesn't exist");
      }

      user.pins = website;
      await this.Users.updateOne({ _id: id }, user);

      return user;
    } catch (e) {
      return this.handleError(e);
    }
  }

  private async getCompleteUrl(feed: IFeeds) {
    const website = await this.Websites.findOne({ _id: feed.website });

    return `${website.website}/${feed.url}`;
  }

  async getFeedUrl(id: string): Promise<string> {
    const feed = await this.Feeds.findOne({ _id: id });

    if (feed) {
      const { url } = feed;

      return url.startsWith('/') ? this.getCompleteUrl(feed) : feed.url;
    }

    return '';
  }

  async getUser(email: string, name?: string): Promise<IUser> {
    const user = await this.Users.findOne({ email });

    if (!user) {
      const newUser = new this.Users({
        _id: new mongoose.Types.ObjectId(),
        email,
        favorites: [],
        name,
        pins: []
      });

      await newUser.save();

      return this.getUser(email);
    }

    return user;
  }

  async getUserById(id: string): Promise<IUser | ErrorResponse> {
    try {
      const user = await this.Users.findOne({ _id: id });

      if (!user) {
        throw new Error("User doesn't exists");
      }

      return user;
    } catch (e) {
      return this.handleError(e);
    }
  }

  async deleteWebsite(id: string): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await this.Websites.deleteOne({ _id: id });

      return {
        success: response.deletedCount === DELETE_COUNT
      };
    } catch (e) {
      return this.handleError(e);
    }
  }

  async deleteFeed(id: string): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await this.Feeds.deleteOne({ _id: id });

      return {
        success: response.deletedCount === DELETE_COUNT
      };
    } catch (e) {
      return this.handleError(e);
    }
  }
}

export default DBController;
