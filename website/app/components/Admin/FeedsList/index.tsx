import React, { useEffect, useState, Fragment } from 'react';
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
  FeedActionDelete,
} from './style';
import { Website, Feeds } from '@devpunk/types';
import { getFeeds, deleteFeed } from '../../../gql';
import { Row } from '../../UI';
import { MdTimer } from 'react-icons/md';
import { FiPenTool, FiTrash2 } from 'react-icons/fi';
import { BsPersonFill } from 'react-icons/bs';
import { getRelativeTime } from '../../../utils';

interface FeedsListProps {
  website: Website;
}

type FeedsList = (props: FeedsListProps) => JSX.Element;

const FeedsList: FeedsList = ({ website }) => {
  const [page, setPage] = useState(1);
  const [feeds, setFeeds] = useState<Feeds[]>([]);

  const loadFeeds = async () => {
    const data = await getFeeds(page, website._id);
    if (page === 1) {
      setFeeds(data);
    } else {
      setFeeds([...feeds, ...data]);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, [website, page]);

  const handleFeedsDelete = (feed: Feeds) => () => {
    deleteFeed(feed._id)
      .then((res) => {
        if (res.deleteFeed.success) {
          setFeeds(feeds.filter(({ _id }) => _id !== feed._id));
        } else {
          console.log('Delete Failed', res);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Container>
      {feeds.length !== 0 &&
        feeds.map((feed) => (
          <FeedsContainer key={feed._id}>
            <Row size="2fr 8fr 1fr" gap="20px">
              <FeedsImage
                src={`http://localhost:3000/api/images/feeds/${feed._id}`}
              />
              <FeedDetails>
                <FeedTitle>{feed.title}</FeedTitle>

                <FeedTagContainer>
                  {feed.tags.length !== 0 &&
                    feed.tags.map((tag) => <FeedTag key={tag}>{tag}</FeedTag>)}
                </FeedTagContainer>

                <Row size="1fr 1fr 1fr">
                  <FeedsMeta>
                    {feed.createdAt && (
                      <Fragment>
                        <FeedMetaIcon>
                          <MdTimer fontSize="22" />
                        </FeedMetaIcon>
                        <FeedMetaText>
                          {getRelativeTime(feed.createdAt)}
                        </FeedMetaText>
                      </Fragment>
                    )}
                  </FeedsMeta>
                  <FeedsMeta>
                    {feed.publishedAt && (
                      <Fragment>
                        <FeedMetaIcon>
                          <FiPenTool fontSize="22" />
                        </FeedMetaIcon>
                        <FeedMetaText>
                          {getRelativeTime(feed.publishedAt)}
                        </FeedMetaText>
                      </Fragment>
                    )}
                  </FeedsMeta>
                  <FeedsMeta>
                    {feed.author && (
                      <Fragment>
                        <FeedMetaIcon>
                          <BsPersonFill fontSize="22" />
                        </FeedMetaIcon>
                        <FeedMetaText>{feed.author}</FeedMetaText>
                      </Fragment>
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
