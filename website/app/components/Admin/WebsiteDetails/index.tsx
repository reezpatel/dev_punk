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
  onEdit: (website: Website) => void;
  onDelete: (website: Website) => void;
}

type WebsiteDetails = (props: WebsiteDetailsProps) => JSX.Element;

const WebsiteDetails: WebsiteDetails = ({ website, onEdit, onDelete }) => {
  const handleOnEdit = () => {
    onEdit(website);
  };

  const handleOnDelete = () => {
    onDelete(website);
  };

  return (
    <Container>
      <WebsiteInfo>
        <Row size="3fr 1fr">
          <WebsiteDetailsContainer>
            <WebsiteTitle>{website.name}</WebsiteTitle>
            <WebsiteLink>{website.website}</WebsiteLink>
          </WebsiteDetailsContainer>
          <WebsiteActions>
            <WebsiteActionEdit onClick={handleOnEdit}>
              <FiEdit3 color="white" fontSize="18" />
            </WebsiteActionEdit>
            <WebsiteActionDelete onClick={handleOnDelete}>
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
