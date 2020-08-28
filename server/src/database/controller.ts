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

    console.log(websites, ids);

    const mapping = {};
    websites.forEach((website) => {
      mapping[website._id] = website;
    });

    return ids.map((id) => mapping[id]);
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
}

export default DBController;
