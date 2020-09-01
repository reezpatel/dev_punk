import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import AdminWebsites from '../../components/Admin/Websites';
import WebsiteDetails from '../../components/Admin/WebsiteDetails';
import { getAllWebsites, deleteWebsite } from '../../gql';
import { Website } from '@devpunk/types';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import Modal from '../../components/Modal';
import WebsiteEdit from '../../components/Admin/WebsiteEdit';

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 68px);
`;

const AdminPage = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isNewModalOpen, setNewModalOpen] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [isEditMode, setEditMode] = useState(false);

  const user = useUserContext();
  const history = useHistory();

  const loadWebsites = async () => {
    const sites = await getAllWebsites();
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
  }, []);

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
    deleteWebsite(website._id)
      .then((res) => {
        if (res.deleteWebsite.success) {
          loadWebsites();
        } else {
          console.log('Delete Failed', res);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Fragment>
      <Header />
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
    </Fragment>
  );
};

export default AdminPage;
