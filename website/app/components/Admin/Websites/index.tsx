import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { Website } from '@devpunk/types';
import Image from '../../../assets/empty.png';
import {
  WebsiteSubTitle,
  WebsiteTitle,
  WebsiteDetailsContainer,
  WebsiteImage,
  WebsiteImageContainer,
  WebsiteBlock,
  EmptyBlockMessage,
  EmptyBlockImg,
  EmptyBlock,
  HeadSection,
  ContentSection,
  NewButton,
  Heading,
  Container
} from './style';
import { CONFIG } from '../../../utils';

interface AdminWebsitesProps {
  websites: Website[];
  onNew: () => void;
  onSiteSelection: (index: number) => void;
  selected: number;
}

type AdminWebsites = (props: AdminWebsitesProps) => JSX.Element;

const AdminWebsites: AdminWebsites = ({
  websites,
  onSiteSelection,
  selected,
  onNew
}) => {
  const handleWebsiteClick = (index) => () => {
    onSiteSelection(index);
  };

  return (
    <Container>
      <HeadSection>
        <Heading>Websites</Heading>
        <NewButton onClick={onNew}>
          <FaPlus color="white" fontSize="18" />
        </NewButton>
      </HeadSection>
      {websites.length ? (
        <ContentSection>
          {websites.map((site, index) => (
            <WebsiteBlock
              key={site.website}
              selected={selected === index}
              onClick={handleWebsiteClick(index)}
            >
              <WebsiteImageContainer>
                <WebsiteImage src={CONFIG.ENDPOINTS.websiteIcon(site._id)} />
              </WebsiteImageContainer>

              <WebsiteDetailsContainer>
                <WebsiteTitle>{site.name}</WebsiteTitle>
                <WebsiteSubTitle>{site.website}</WebsiteSubTitle>
              </WebsiteDetailsContainer>
            </WebsiteBlock>
          ))}
        </ContentSection>
      ) : (
        <EmptyBlock>
          <EmptyBlockImg src={Image} />
          <EmptyBlockMessage>It&apos;s empty here..</EmptyBlockMessage>
        </EmptyBlock>
      )}
    </Container>
  );
};

export default AdminWebsites;
