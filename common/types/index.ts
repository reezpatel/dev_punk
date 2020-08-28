interface Website {
  _id: string | null;
  name: string;
  type: string;
  website: string;
  order: number;
  feed: string;
  active: boolean;
}

interface Feeds {
  _id: string;
  title: string;
  createdAt: string;
  publishedAt: string;
  author: string;
  tags: string[];
  website: Website;
}

export { Website, Feeds };
