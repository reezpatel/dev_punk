import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Website } from '@devpunk/types';
import { Header, WebsiteList, FeedsGrid, SearchBar } from '../../components';
import { getFeedColumnCount, gql } from '../../utils';

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 68px);
  overflow: hidden;
`;

const FeedContainer = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-rows: 80px 1fr;
`;

const FeedsPage = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showMenu, setShowMenu] = useState(false);
  const [websites, setWebsite] = useState<Website[]>([]);
  const [selected, setSelected] = useState(-1);
  const [columns, setColumns] = useState(getFeedColumnCount());
  const [query, setQuery] = useState('');

  const loadWebsites = async () => {
    const sites = await gql.getAllWebsites();

    setWebsite(sites);
    setSelected(-1);
  };

  const resizeListener = () => {
    setColumns(getFeedColumnCount());
  };

  useEffect(() => {
    loadWebsites();
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  const handleWebsiteSelection = (index) => {
    setSelected(index);
    setQuery('');
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onMenuClicked = () => {};

  const handleQueryInput = (str: string) => {
    setQuery(str);
  };

  return (
    <>
      <Header showMenuIcon={showMenu} onMenuClick={onMenuClicked} />
      <Container>
        <WebsiteList
          onChange={handleWebsiteSelection}
          selected={selected}
          websites={websites}
        />
        <FeedContainer>
          <SearchBar value={query} onChange={handleQueryInput} />

          <FeedsGrid
            website={websites[selected]?._id}
            columns={columns}
            selected={selected}
            query={query}
          />
        </FeedContainer>
      </Container>
    </>
  );
};

export default FeedsPage;
