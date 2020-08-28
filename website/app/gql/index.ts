import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { Website, Feeds } from '@devpunk/types';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
});

const getAllWebsites = async () => {
  const query = gql`
    query {
      websites {
        name
        _id
        website
      }
    }
  `;

  try {
    const result = await client.query<{ websites: Website[] }>({
      query,
      fetchPolicy: 'no-cache',
    });

    return result.data.websites;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to add website');
  }
};

interface WebsiteMutationResponse extends Website {
  addWebsite: {
    error: string;
  };
}

const addNewWebsite = async (website: Website) => {
  const mutation = gql`
    mutation($website: IWebsite!) {
      addWebsite(website: $website) {
        name
        _id
        error
      }
    }
  `;

  let result;
  try {
    result = await client.mutate<WebsiteMutationResponse>({
      mutation,
      variables: {
        website,
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to add website');
  }

  if (result.errors?.length) {
    throw new Error(result.errors[0].name);
  }

  if (result.data.addWebsite.error) {
    throw new Error(result.data.addWebsite.error);
  }

  return result.data;
};

const getFeeds = async (page: number, website: string) => {
  const query = gql`
    query($page: Int!, $website: String) {
      feeds(page: $page, website: $website) {
        _id
        title
        author
        tags
        createdAt
        publishedAt
        author
        website {
          name
          _id
          website
          order
        }
      }
    }
  `;

  try {
    const result = await client.query<{ feeds: Feeds[] }>({
      query,
      variables: {
        page,
        website,
      },
    });

    return result.data.feeds as Feeds[];
  } catch (e) {
    console.error(e);
    throw new Error('Failed to add website');
  }
};

export { getAllWebsites, addNewWebsite, getFeeds };
