const BASE_URL = process.env.API_SERVER_URL;

const ENDPOINTS = {
  websiteIcon: (id: string): string =>
    `${BASE_URL}/api/v1/images/website/${id}`,
  feedBanner: (id: string): string => `${BASE_URL}/api/v1/images/feeds/${id}`,
  redirect: (id: string): string => `${BASE_URL}/api/v1/r/${id}`,
  authCode: (code: string): string => `${BASE_URL}/api/v1/auth/${code}`,
  imageUpload: `${BASE_URL}/api/v1/images/website`,
  gqlServer: `${BASE_URL}/graphql`,
  authUrl: `${BASE_URL}/api/v1/auth/validate`
};

export default ENDPOINTS;
