import React from 'react';
import {
  WebsiteContainer,
  Title,
  WebsiteItem,
  WebsiteIcon,
  WebsiteText,
} from './style';
import { Website } from '@devpunk/types';

interface WebsiteListProps {
  websites: Website[];
  selected: number;
}

type WebsiteList = (props: WebsiteListProps) => JSX.Element;

const WebsiteList: WebsiteList = ({ websites, selected }) => {
  return (
    <WebsiteContainer>
      <Title>Feeds</Title>
      {0 !== websites.length &&
        websites.map((website, index) => (
          <WebsiteItem selected={index === selected} key={website._id}>
            <WebsiteIcon
              src={`http://localhost:3000/api/images/website/${website._id}`}
            ></WebsiteIcon>
            <WebsiteText>{website.name}</WebsiteText>
          </WebsiteItem>
        ))}
    </WebsiteContainer>
  );
};

export default WebsiteList;
