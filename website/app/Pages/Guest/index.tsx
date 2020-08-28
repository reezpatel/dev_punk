import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import WebsiteList from '../../components/WebsiteList';
import FeedsGrid from '../../components/FeedsGrid';
import { Website } from '@devpunk/types';
import { getAllWebsites } from '../../gql';
import SearchBar from '../../components/SearchBar';

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 68px);
`;

const FeedContainer = styled.div`
  padding: 25px;
`;

const GuestPage = () => {
  const [websites, setWebsite] = useState<Website[]>([]);
  const [selected, setSelected] = useState(-1);

  const loadWebsites = async () => {
    const sites = await getAllWebsites();
    setWebsite(sites);
    setSelected(0);
  };

  useEffect(() => {
    loadWebsites();
  }, []);

  return (
    <Fragment>
      <Header />
      <Container>
        <WebsiteList selected={selected} websites={websites}></WebsiteList>
        <FeedContainer>
          <SearchBar></SearchBar>
          {websites[selected] && (
            <FeedsGrid website={websites[selected]._id} columns={4}></FeedsGrid>
          )}
        </FeedContainer>
      </Container>
    </Fragment>
  );
};

export default GuestPage;
