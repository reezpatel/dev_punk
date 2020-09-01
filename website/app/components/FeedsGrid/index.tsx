import React, { useState, useEffect, useRef } from 'react';
import { Feeds } from '@devpunk/types';
import { getFeeds } from '../../gql';
import {
  FeedsContainer,
  FeedColumns,
  FeedBlock,
  FeedImage,
  FeedDetails,
  FeedsTitle,
  FeedsMeta,
  FeedMetaTitle,
  FeedMetaAction,
} from './style';
import { getRelativeTime } from '../../utils';
import { FeedMetaIcon } from '../Admin/FeedsList/style';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';

const BATCH_SIZE = 1;

interface FeedsGridProps {
  website: string;
  columns?: number;
}

type FeedsGrid = (props: FeedsGridProps) => JSX.Element;

const getEmptyData = (columns: number) => {
  return Array(columns)
    .fill(1)
    .map(() => []);
};

const FeedsGrid = ({ website, columns }) => {
  const [feeds, setFeeds] = useState<Feeds[]>([]);
  const [page, setPage] = useState(1);
  const lock = useRef(false);
  const containerRef = useRef<HTMLDivElement>();

  const [data, setData] = useState<Feeds[][]>(getEmptyData(columns));

  const loadFeeds = async () => {
    if (lock.current) {
      return;
    }
    lock.current = true;

    const entries = await getFeeds(page, website);
    setPage(page + 1);

    if (page === 1) {
      setFeeds(entries);
    } else {
      setFeeds([...feeds, ...entries]);
    }

    lock.current = false;
  };

  const renderFeeds = () => {
    if (lock.current) {
      return;
    }
    lock.current = true;

    const items = feeds.slice(0, BATCH_SIZE);
    const children = containerRef.current.children;
    const length = children.length;

    const _data = [...data];

    for (const feed of items) {
      let minHeightIndex = 0;
      let minHeight = Number.MAX_VALUE;

      for (let i = 0; i < length; i++) {
        const lastChild = children.item(i).lastChild as HTMLDivElement;

        const height =
          (lastChild?.offsetTop ?? 0) + (lastChild?.clientHeight ?? 0);

        if (minHeight > height) {
          minHeight = height;
          minHeightIndex = i;
        }
      }

      _data[minHeightIndex].push(feed);
    }

    setFeeds(feeds.slice(BATCH_SIZE));
    setData(_data);
    lock.current = false;
  };

  useEffect(() => {
    if (!lock.current && feeds.length) {
      renderFeeds();
    }
  }, [feeds]);

  useEffect(() => {
    setData(getEmptyData(columns));
    loadFeeds();
  }, [page]);

  useEffect(() => {
    setData(getEmptyData(columns));
    setPage(1);
  }, [columns, website]);

  const handleFeedClick = (id) => () => {
    window.open(`http://localhost:3000/r/${id}`);
  };

  return (
    <FeedsContainer
      ref={(r) => {
        containerRef.current = r;
      }}
      columns={columns}
    >
      {data.map((cols, index) => (
        <FeedColumns key={index}>
          {cols.map((feed) => (
            <FeedBlock key={feed._id} onClick={handleFeedClick(feed._id)}>
              <FeedImage
                src={`http://localhost:3000/api/images/feeds/${feed._id}`}
              ></FeedImage>
              <FeedDetails>
                <FeedsTitle>{feed.title}</FeedsTitle>
                <FeedsMeta>
                  <FeedMetaTitle>
                    {getRelativeTime(feed.publishedAt || feed.createdAt)}
                    {feed.author ? ` • ${feed.author}` : ''}
                  </FeedMetaTitle>
                  <FeedMetaAction>
                    <IoMdHeartEmpty />
                  </FeedMetaAction>
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
