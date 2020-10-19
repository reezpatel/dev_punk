interface Website {
  _id: string | null;
  name: string;
  type: string;
  website: string;
  order: number;
  feed: string;
  active: boolean;
  success?: boolean;
  hasImage?: boolean;
}

interface Feeds {
  _id: string | any;
  title: string;
  createdAt: string;
  publishedAt: string;
  author: string;
  tags: string[];
  website: Website;
  url?: string;
  success?: boolean;
  image: string;
}

interface User {
  name: string;
  favorites: Feeds[];
  pins: Website[];
}

export { Website, Feeds, User };
