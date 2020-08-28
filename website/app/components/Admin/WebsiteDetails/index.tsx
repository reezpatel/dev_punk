import React from 'react';
import {
  Container,
  WebsiteInfo,
  WebsiteDetailsContainer,
  WebsiteTitle,
  WebsiteLink,
  WebsiteActions,
  WebsiteActionEdit,
  WebsiteActionDelete,
} from './style';
import { Row } from '../../UI';
import { Website } from '@devpunk/types';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import FeedsList from '../FeedsList';

interface WebsiteDetailsProps {
  website: Website;
}

type WebsiteDetails = (props: WebsiteDetailsProps) => JSX.Element;

const WebsiteDetails: WebsiteDetails = ({ website }) => {
  return (
    <Container>
      <WebsiteInfo>
        <Row size="3fr 1fr">
          <WebsiteDetailsContainer>
            <WebsiteTitle>{website.name}</WebsiteTitle>
            <WebsiteLink>{website.website}</WebsiteLink>
          </WebsiteDetailsContainer>
          <WebsiteActions>
            <WebsiteActionEdit>
              <FiEdit3 color="white" fontSize="18" />
            </WebsiteActionEdit>
            <WebsiteActionDelete>
              <FiTrash2 color="white" fontSize="18" />
            </WebsiteActionDelete>
          </WebsiteActions>
        </Row>
      </WebsiteInfo>
      <FeedsList website={website} />
    </Container>
  );
};

export default WebsiteDetails;
