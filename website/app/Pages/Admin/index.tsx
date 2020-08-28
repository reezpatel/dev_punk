import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import AdminWebsites from '../../components/Admin/Websites';
import WebsiteDetails from '../../components/Admin/WebsiteDetails';
import { getAllWebsites } from '../../gql';
import { Website } from '@devpunk/types';

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 68px);
`;

const AdminPage = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selected, setSelected] = useState(-1);

  const loadWebsites = async () => {
    const sites = await getAllWebsites();
    setWebsites(sites);
  };

  useEffect(() => {
    setSelected(0);
  }, [websites]);

  useEffect(() => {
    loadWebsites();
  }, []);

  const handleSelection = (index) => {
    setSelected(index);
  };

  return (
    <Fragment>
      <Header />
      <Container>
        <AdminWebsites
          websites={websites}
          loadWebsites={loadWebsites}
          onSiteSelection={handleSelection}
          selected={selected}
        />
        {websites[selected] && <WebsiteDetails website={websites[selected]} />}
      </Container>
    </Fragment>
  );
};

export default AdminPage;
