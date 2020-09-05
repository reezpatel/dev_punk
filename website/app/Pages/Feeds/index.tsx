import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Website } from '@devpunk/types';
import { Header, WebsiteList, FeedsGrid } from '../../components';
// import WebsiteList from '../../components/WebsiteList';
// import SearchBar from '../../components/SearchBar';
// import { useUserContext } from '../../context';
import { getFeedColumnCount, gql } from '../../utils';

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 68px);
`;

const FeedContainer = styled.div`
  padding: 25px;
`;

const FeedsPage = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showMenu, setShowMenu] = useState(false);
  const [websites, setWebsite] = useState<Website[]>([]);
  const [selected, setSelected] = useState(-1);
  const [columns, setColumns] = useState(getFeedColumnCount());

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
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onMenuClicked = () => {};

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
          {/* <SearchBar /> */}

          <FeedsGrid
            website={websites[selected]?._id}
            columns={columns}
            selected={selected}
          />
        </FeedContainer>
      </Container>
    </>
  );
};

export default FeedsPage;
