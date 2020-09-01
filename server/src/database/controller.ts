import mongoose, { Model } from 'mongoose';
import { IWebsite, IFeeds, IUser } from './schema';
import { FastifyLoggerInstance } from 'fastify';

class DBController {
  constructor(
    private Websites: Model<IWebsite, {}>,
    private Feeds: Model<IFeeds, {}>,
    private Users: Model<IUser, {}>,
    private logger: FastifyLoggerInstance
  ) {}

  private handleError(e: any) {
    this.logger.error({
      module: 'DBController',
      message: e.message,
      stack: e.stack,
    });

    console.log('this error', Array.isArray(e.errors));

    if (
      e.errors &&
      Array.isArray(Object.values(e.errors)) &&
      Object.values(e.errors).length
    ) {
      return {
        error: (Object.values(e.errors)[0] as any).message,
      };
    }

    return {
      error: e.message,
    };
  }

  async getAllWebsites() {
    try {
      return this.Websites.find();
    } catch (e) {
      return this.handleError(e);
    }
  }

  async addNewWebsite(website: any) {
    try {
      const doc = await this.Websites.findOne({ feed: website.feed });

      if (doc) {
        return {
          error: `Website ${doc.name} already exist for provided feed`,
        };
      }

      website._id = mongoose.Types.ObjectId();

      const res = await new this.Websites(website).save();
      return res;
    } catch (e) {
      return this.handleError(e);
    }
  }

  async editWebsite(website: any) {
    try {
      const doc = await this.Websites.findOne({ _id: website._id });

      console.log('ffsfs');

      if (!doc) {
        return {
          error: `Website doesn't exist`,
        };
      }

      const { _id, ...rest } = website;
      await this.Websites.updateOne({ _id }, rest);

      return this.Websites.findOne({ _id: website._id });
    } catch (e) {
      return this.handleError(e);
    }
  }

  async addFeeds(feeds: any) {
    const insertableFeed = [];
    try {
      for (const feed of feeds) {
        const doc = await this.Feeds.findOne({
          url: feed.url,
        });

        if (!doc) {
          insertableFeed.push(feed);
        }
      }

      return this.Feeds.insertMany(insertableFeed, {
        ordered: true,
        rawResult: false,
      });
    } catch (e) {
      this.handleError(e);
      return [] as IFeeds[];
    }
  }

  async getFeeds(page: number, website: string) {
    try {
      if (website) {
        return this.Feeds.find({
          website,
        })
          .limit(10)
          .skip((page - 1) * 10);
      } else {
        return this.Feeds.find()
          .limit(10)
          .skip((page - 1) * 10);
      }
    } catch (e) {
      return this.handleError(e);
    }
  }

  async resolveFeedsToWebsite(feeds: IFeeds[]) {
    const ids = feeds.map(({ website }) => mongoose.Types.ObjectId(website));
    const websites = await this.Websites.where('_id').in(ids);

    const mapping = {};
    websites.forEach((website) => {
      mapping[website._id] = website;
    });

    return ids.map((id) => mapping[`${id}`]);
  }

  async resolveFavorites(favorites: string[]) {
    const ids = favorites.map((id) => mongoose.Types.ObjectId(id));
    const feeds = await this.Feeds.where('_id').in(ids);

    const mapping = {};
    feeds.forEach((website) => {
      mapping[website._id] = website;
    });

    return ids.map((id) => mapping[`${id}`]);
  }

  async resolvePins(pins: string[]) {
    const ids = pins.map((id) => mongoose.Types.ObjectId(id));
    const websites = await this.Websites.where('_id').in(ids);

    const mapping = {};
    websites.forEach((website) => {
      mapping[website._id] = website;
    });

    return ids.map((id) => mapping[`${id}`]);
  }

  async updateFavorites(id: string, feeds: string[]) {
    const user = await this.Users.findOne({ _id: id });
    try {
      if (!user) {
        throw new Error("User doesn't exist");
      }
      user.favorites = feeds;

      this.Users.updateOne({ _id: id }, user);
      return user;
    } catch (e) {
      return this.handleError(e);
    }
  }

  async updatePins(id: string, website: string[]) {
    const user = await this.Users.findOne({ _id: id });
    try {
      if (!user) {
        throw new Error("User doesn't exist");
      }
      user.pins = website;

      this.Users.updateOne({ _id: id }, user);

      return user;
    } catch (e) {
      return this.handleError(e);
    }
  }

  private async getCompleteUrl(feed: IFeeds) {
    const website = await this.Websites.findOne({ _id: feed.website });

    return `${website.website}/${feed.url}`;
  }

  async getFeedUrl(id: string) {
    const feed = await this.Feeds.findOne({ _id: id });

    if (feed) {
      const url = feed.url;
      return url.startsWith('/') ? this.getCompleteUrl(feed) : feed.url;
    }

    return '';
  }

  async getUser(email: string, name?: string): Promise<IUser> {
    const user = await this.Users.findOne({ email });

    if (!user) {
      const newUser = new this.Users({
        _id: mongoose.Types.ObjectId(),
        email,
        name,
        favorites: [],
        pins: [],
      });

      await newUser.save();

      return this.getUser(email);
    }

    return user;
  }

  async getUserById(id: string) {
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

  async deleteWebsite(id: string) {
    try {
      const response = await this.Websites.deleteOne({ _id: id });
      return {
        success: response.deletedCount === 1,
      };
    } catch (e) {
      return this.handleError(e);
    }
  }

  async deleteFeed(id: string) {
    try {
      const response = await this.Feeds.deleteOne({ _id: id });
      return {
        success: response.deletedCount === 1,
      };
    } catch (e) {
      return this.handleError(e);
    }
  }
}

export default DBController;
