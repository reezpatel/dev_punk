import React, { useEffect, useState, useRef } from 'react';
import { Website, Feeds } from '@devpunk/types';
import { MdTimer } from 'react-icons/md';
import { FiPenTool, FiTrash2 } from 'react-icons/fi';
import { BsPersonFill } from 'react-icons/bs';
import {
  Container,
  FeedsContainer,
  FeedsImage,
  FeedDetails,
  FeedTitle,
  FeedTagContainer,
  FeedTag,
  FeedsMeta,
  FeedMetaIcon,
  FeedMetaText,
  FeedActionContainer,
  FeedActionDelete
} from './style';
import { Row } from '../../UI';
import { getRelativeTime, gql, CONFIG } from '../../../utils';

const LOAD_OFFSET = 600;

interface FeedsListProps {
  website: Website;
}

type FeedsList = (props: FeedsListProps) => JSX.Element;

const FeedsList: FeedsList = ({ website }) => {
  const [page, setPage] = useState(1);
  const [feeds, setFeeds] = useState<Feeds[]>([]);
  const containerRef = useRef<HTMLDivElement>();
  const lock = useRef<boolean>(false);
  const [hasMore, setHasMore] = useState(true);

  const loadFeeds = async () => {
    if (lock.current || !hasMore) {
      return;
    }

    lock.current = true;
    const data = await gql.getFeeds(page, website._id);

    if (data.length === 0) {
      setHasMore(false);
    }

    if (page === 1) {
      setFeeds(data);
    } else {
      setFeeds([...feeds, ...data]);
    }

    setPage(page + 1);

    lock.current = false;
  };

  const handleOnScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;

    if (scrollHeight - (scrollTop + clientHeight) < LOAD_OFFSET) {
      loadFeeds();
    }
  };

  useEffect(() => {
    if (feeds.length === 0) {
      loadFeeds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeds]);

  useEffect(() => {
    setHasMore(true);
    setPage(1);
    setFeeds([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [website]);

  const handleFeedsDelete = (feed: Feeds) => () => {
    gql
      .deleteFeed(feed._id)
      .then((res) => {
        if (res.success) {
          setFeeds(feeds.filter(({ _id }) => _id !== feed._id));
        } else {
          // eslint-disable-next-line no-console
          console.error('Delete Failed', res);
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  return (
    <Container
      onScroll={handleOnScroll}
      ref={(r) => {
        containerRef.current = r;
      }}
    >
      {feeds.length !== 0 &&
        feeds.map((feed) => (
          <FeedsContainer key={feed._id}>
            <Row size="2fr 8fr 1fr" gap="20px">
              <FeedsImage src={CONFIG.ENDPOINTS.feedBanner(feed._id)} />
              <FeedDetails>
                <FeedTitle>{feed.title}</FeedTitle>

                <FeedTagContainer>
                  {feed.tags.length !== 0 &&
                    feed.tags.map((tag) => <FeedTag key={tag}>{tag}</FeedTag>)}
                </FeedTagContainer>

                <Row size="1fr 1fr 1fr">
                  <FeedsMeta>
                    {feed.createdAt && (
                      <>
                        <FeedMetaIcon>
                          <MdTimer fontSize="22" />
                        </FeedMetaIcon>
                        <FeedMetaText>
                          {getRelativeTime(feed.createdAt)}
                        </FeedMetaText>
                      </>
                    )}
                  </FeedsMeta>
                  <FeedsMeta>
                    {feed.publishedAt && (
                      <>
                        <FeedMetaIcon>
                          <FiPenTool fontSize="22" />
                        </FeedMetaIcon>
                        <FeedMetaText>
                          {getRelativeTime(feed.publishedAt)}
                        </FeedMetaText>
                      </>
                    )}
                  </FeedsMeta>
                  <FeedsMeta>
                    {feed.author && (
                      <>
                        <FeedMetaIcon>
                          <BsPersonFill fontSize="22" />
                        </FeedMetaIcon>
                        <FeedMetaText>{feed.author}</FeedMetaText>
                      </>
                    )}
                  </FeedsMeta>
                </Row>
              </FeedDetails>

              <FeedActionContainer>
                <FeedActionDelete onClick={handleFeedsDelete(feed)}>
                  <FiTrash2 color="white" fontSize="18" />
                </FeedActionDelete>
              </FeedActionContainer>
            </Row>
          </FeedsContainer>
        ))}
    </Container>
  );
};

export default FeedsList;
