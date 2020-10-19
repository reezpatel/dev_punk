import { Document } from 'mongoose';

interface IWebsite extends Document {
  _id: string;
  name: string;
  type: string;
  website: string;
  order: string;
  feed: string;
  active: boolean;
  hasImage: boolean;
}

interface IFeeds extends Document {
  _id: string;
  title: string;
  url: string;
  createdAt: string;
  publishedAt: string;
  author: string;
  tags: string[];
  website: string;
  image: string;
}

interface IUser extends Document {
  name: string;
  email: string;
  favorites: string[];
  pins: string[];
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  success: boolean;
}

interface MongooseError {
  message?: string;
  stack?: string;
  errors: { message: string }[];
}

export {
  IWebsite,
  IFeeds,
  IUser,
  ErrorResponse,
  SuccessResponse,
  MongooseError
};
