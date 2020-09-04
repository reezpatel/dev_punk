import * as gql from './gql';
import colors from './colors';
import * as request from './request';

const getRelativeTime = (time: string): string => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = new Date().getTime() - new Date(time).getTime();

  if (elapsed < msPerMinute) {
    return `${Math.round(elapsed / 1000)} seconds ago`;
  }

  if (elapsed < msPerHour) {
    return `${Math.round(elapsed / msPerMinute)} minutes ago`;
  }

  if (elapsed < msPerDay) {
    return `${Math.round(elapsed / msPerHour)} hours ago`;
  }

  if (elapsed < msPerMonth) {
    return `${Math.round(elapsed / msPerDay)} days ago`;
  }

  if (elapsed < msPerYear) {
    return `${Math.round(elapsed / msPerMonth)} months ago`;
  }

  return `${Math.round(elapsed / msPerYear)} years ago`;
};

const getFeedColumnCount = (): number => {
  const width = window.innerWidth;
  const isMobile = width < 480;
  const normalizedWidth = isMobile ? width : width - 300;

  return Math.ceil(normalizedWidth / 360);
};

const CONFIG = {
  BREAKPOINTS: {
    mobile: 600,
    tablet: 768,
    desktop: 1200
  },
  ENDPOINTS: {
    websiteIcon: (id: string): string =>
      `http://localhost:3000/api/v1/images/website/${id}`,
    feedBanner: (id: string): string =>
      `http://localhost:3000/api/v1/images/feeds/${id}`,
    redirect: (id: string): string => `http://localhost:3000/api/v1/r/${id}`,
    authCode: (code: string): string =>
      `http://localhost:3000/api/v1/auth/${code}`,
    imageUpload: 'http://localhost:3000/api/images'
  },
  WEBSITE_IDS: {
    ALL_WEBSITE: -1,
    PINNED_WEBSITE: -2
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

export {
  getRelativeTime,
  getFeedColumnCount,
  gql,
  colors,
  request,
  CONFIG,
  noop
};
