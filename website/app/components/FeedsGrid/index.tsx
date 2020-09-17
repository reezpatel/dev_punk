import React, { useState, useEffect, useRef } from 'react';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { Feeds } from '@devpunk/types';
import {
  FeedsContainer,
  FeedColumns,
  FeedBlock,
  FeedImage,
  FeedDetails,
  FeedsTitle,
  FeedsMeta,
  FeedMetaTitle,
  FeedMetaAction
} from './style';
import { getRelativeTime, CONFIG, gql, colors } from '../../utils';
import { useDeviceContext, useUserContext } from '../../context';

const BATCH_SIZE = 2;
const LOAD_OFFSET = 600;

interface FeedsGridProps {
  selected: string;
  columns?: number;
  query: string;
}

type FeedsGrid = (props: FeedsGridProps) => JSX.Element;

const getEmptyData = (columns: number) => {
  return Array(columns)
    .fill(1)
    .map(() => []);
};

const FeedsGrid: FeedsGrid = ({ columns, selected, query }) => {
  const [feeds, setFeeds] = useState<Feeds[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const lock = useRef(false);
  const containerRef = useRef<HTMLDivElement>();
  const user = useUserContext();
  const device = useDeviceContext();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const [data, setData] = useState<Feeds[][]>(getEmptyData(columns));

  const loadFeeds = async () => {
    if (lock.current || !hasMore) {
      return;
    }
    lock.current = true;

    let entries;

    if (selected === CONFIG.WEBSITE_IDS.PINNED_WEBSITE) {
      entries = user.user.favorites;
      setHasMore(false);
    } else if (selected === CONFIG.WEBSITE_IDS.ALL_WEBSITE) {
      entries = await gql.getFeeds(page, '', query);
    } else {
      entries = await gql.getFeeds(page, selected, query);
    }

    setPage(page + 1);

    if (entries.length === 0) {
      setHasMore(false);
    }

    if (page === 1) {
      setFeeds(entries);
    } else {
      setFeeds([...feeds, ...entries]);
    }

    lock.current = false;
  };

  const handleOnScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;

    if (scrollHeight - (scrollTop + clientHeight) < LOAD_OFFSET) {
      loadFeeds();
    }
  };

  const renderFeeds = () => {
    if (lock.current) {
      return;
    }
    lock.current = true;

    const items = feeds.slice(0, BATCH_SIZE);
    const { children } = containerRef.current;
    const { length } = children;

    const _data = [...data];

    items.forEach((feed) => {
      let minHeightIndex = 0;
      let minHeight = Number.MAX_VALUE;

      for (let i = 0; i < length; i += 1) {
        const lastChild = children.item(i).lastChild as HTMLDivElement;

        const height =
          (lastChild?.offsetTop ?? 0) + (lastChild?.clientHeight ?? 0);

        if (minHeight > height) {
          minHeight = height;
          minHeightIndex = i;
        }
      }

      _data[minHeightIndex].push(feed);
    });

    setFeeds(feeds.slice(BATCH_SIZE));
    setData(_data);
    lock.current = false;
  };

  const handleHeartClick = (feed: Feeds) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorites[feed._id]) {
      const index = user.user.favorites.findIndex(
        (pin) => pin._id === feed._id
      );
      user.setFavorites(
        user.user.favorites
          .slice(0, index)
          .concat(user.user.favorites.slice(index + 1))
      );
    } else {
      user.setFavorites([...user.user.favorites, feed]);
    }
  };

  useEffect(() => {
    if (!lock.current && feeds.length) {
      renderFeeds();
    }

    if (!lock.current && !feeds.length) {
      handleOnScroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeds]);

  useEffect(() => {
    loadFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const favs = {};
    user.user.favorites.forEach((fav) => {
      favs[fav._id] = true;
    });

    setFavorites(favs);
  }, [user]);

  useEffect(() => {
    setHasMore(true);
    setData(getEmptyData(columns));
    setPage(1);
  }, [columns, selected, query, device]);

  const handleFeedClick = (id: string) => () => {
    window.open(CONFIG.ENDPOINTS.redirect(id));
  };

  return (
    <FeedsContainer
      onScroll={handleOnScroll}
      ref={(r) => {
        containerRef.current = r;
      }}
      columns={columns}
    >
      {data.map((cols, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <FeedColumns key={index}>
          {cols.map((feed) => (
            <FeedBlock key={feed._id} onClick={handleFeedClick(feed._id)}>
              <FeedImage src={CONFIG.ENDPOINTS.feedBanner(feed._id)} />
              <FeedDetails>
                <FeedsTitle>{feed.title}</FeedsTitle>
                <FeedsMeta>
                  <FeedMetaTitle>
                    {getRelativeTime(feed.publishedAt || feed.createdAt)}
                    {feed.author ? ` • ${feed.author}` : ''}
                  </FeedMetaTitle>
                  {user.user.isLoggedIn && (
                    <FeedMetaAction onClick={handleHeartClick(feed)}>
                      {favorites[feed._id] ? (
                        <IoMdHeart color={colors.heartColor} />
                      ) : (
                        <IoMdHeartEmpty />
                      )}
                    </FeedMetaAction>
                  )}
                </FeedsMeta>
              </FeedDetails>
            </FeedBlock>
          ))}
        </FeedColumns>
      ))}
    </FeedsContainer>
  );
};

export default FeedsGrid;
