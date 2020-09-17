import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Website } from '@devpunk/types';
import { useDeviceContext } from '../../context';
import { Header, WebsiteList, FeedsGrid, SearchBar } from '../../components';
import { CONFIG, getFeedColumnCount, gql } from '../../utils';

const Container = styled.div<{ isMenuVisible: boolean }>`
  padding-left: ${(prop) => (prop.isMenuVisible ? '300px' : '0')};
  height: calc(100vh - 68px);
  overflow: hidden;
  position: relative;
`;

const FeedContainer = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-rows: 80px 1fr;
`;

const FeedsPage = (): JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);
  const [websites, setWebsite] = useState<Website[]>([]);
  const [selected, setSelected] = useState('');
  const [columns, setColumns] = useState(getFeedColumnCount());
  const [query, setQuery] = useState('');
  const device = useDeviceContext();

  const loadWebsites = async () => {
    const sites = await gql.getAllWebsites();

    setWebsite(sites);
    setSelected(CONFIG.WEBSITE_IDS.ALL_WEBSITE);
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

  useEffect(() => {
    setShowMenu(device.device.type === 'DESKTOP');
  }, [device]);

  const handleWebsiteSelection = (id: string) => {
    setSelected(id);
    setQuery('');
    if (device.device.type !== 'DESKTOP') {
      setShowMenu(false);
    }
  };

  const onMenuClicked = () => {
    setShowMenu(!showMenu);
  };

  const handleQueryInput = (str: string) => {
    setQuery(str);
  };

  return (
    <>
      <Header
        showMenuIcon={device.device.type !== 'DESKTOP'}
        onMenuClick={onMenuClicked}
      />
      <Container
        data-device-type={device.device.type}
        isMenuVisible={device.device.type === 'DESKTOP'}
      >
        <WebsiteList
          onChange={handleWebsiteSelection}
          selected={selected}
          websites={websites}
          visible={showMenu}
        />
        <FeedContainer>
          <SearchBar value={query} onChange={handleQueryInput} />

          <FeedsGrid columns={columns} selected={selected} query={query} />
        </FeedContainer>
      </Container>
    </>
  );
};

export default FeedsPage;
