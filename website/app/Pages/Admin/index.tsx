import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Website } from '@devpunk/types';
import { Header, Modal } from '../../components';
import {
  AdminWebsites,
  WebsiteDetails,
  WebsiteEdit
} from '../../components/Admin';
import { gql, noop } from '../../utils';
import { useUserContext } from '../../context';

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 68px);
  overflow: hidden;
`;

const AdminPage = (): JSX.Element => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isNewModalOpen, setNewModalOpen] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [isEditMode, setEditMode] = useState(false);

  const user = useUserContext();
  const history = useHistory();

  const loadWebsites = async () => {
    const sites = await gql.getAllWebsites();
    setWebsites(sites);
  };

  useEffect(() => {
    setSelected(0);
  }, [websites]);

  useEffect(() => {
    if (!user.user.isLoggedIn) {
      history.replace('/');
    }
    loadWebsites();
  }, [history, user]);

  const handleSelection = (index) => {
    setSelected(index);
  };

  const handleModalClose = () => {
    setNewModalOpen(false);
    loadWebsites();
  };

  const handleModalOpen = () => {
    setEditMode(false);
    setNewModalOpen(true);
  };

  const handleWebsiteEdit = () => {
    setEditMode(true);
    setNewModalOpen(true);
  };

  const handleWebsiteDelete = (website: Website) => {
    gql
      .deleteWebsite(window.localStorage.getItem('AUTH_TOKEN'), website._id)
      .then((res) => {
        if (res.success) {
          loadWebsites();
        } else {
          // eslint-disable-next-line no-console
          console.error('Delete Failed', res);
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  return (
    <>
      <Header showMenuIcon={false} onMenuClick={noop} />
      <Modal
        onClose={handleModalClose}
        title="Add New Website"
        isOpen={isNewModalOpen}
      >
        <WebsiteEdit
          editMode={isEditMode}
          onClose={handleModalClose}
          website={websites[selected]}
        />
      </Modal>
      <Container>
        <AdminWebsites
          websites={websites}
          onNew={handleModalOpen}
          onSiteSelection={handleSelection}
          selected={selected}
        />
        {websites[selected] && (
          <WebsiteDetails
            onDelete={handleWebsiteDelete}
            onEdit={handleWebsiteEdit}
            website={websites[selected]}
          />
        )}
      </Container>
    </>
  );
};

export default AdminPage;
