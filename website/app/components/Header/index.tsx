import React, { useState } from 'react';
import {
  AppHeader,
  AppIcon,
  AppHeading,
  HeaderOption,
  HeaderOptions,
  LoginContainer,
  LoginText,
  LoginLink,
  LoginButton,
  LoginTitle,
  LoginWrapper,
} from './style';
import Icon from '../../assets/logo.png';
import Modal from '../Modal';
import { Row } from '../UI';
import { FaGithub } from 'react-icons/fa';
import { useUserContext } from '../../context/UserContext';

const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const user = useUserContext();

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleLoginButtonClick = () => {
    const URL = `https://github.com/login/oauth/authorize?client_id=95469d58ffff15bc6684`;

    window.location.href = URL;
  };

  const handleLogout = () => {
    console.log('Will logout');
  };

  return (
    <AppHeader>
      <AppIcon src={Icon}></AppIcon>
      <AppHeading>Devpunk</AppHeading>
      <HeaderOptions>
        {user.user.isLoggedIn ? (
          <HeaderOption onClick={handleLogout}>Logout</HeaderOption>
        ) : (
          <HeaderOption onClick={handleModalOpen}>Login</HeaderOption>
        )}
      </HeaderOptions>
      <Modal onClose={handleModalClose} isOpen={isOpen} title={'Login'}>
        <LoginContainer>
          <LoginTitle>Hello There, </LoginTitle>
          <LoginText>Login into Devpunk using you social account.</LoginText>
          <LoginWrapper>
            <LoginButton onClick={handleLoginButtonClick}>
              <FaGithub size="24" /> &nbsp; &nbsp; Login with Github
            </LoginButton>
          </LoginWrapper>
          <Row size="1fr 1fr">
            <LoginLink href="#">Privacy Policy</LoginLink>
            <LoginLink href="#">Terms &amp; Conditions</LoginLink>
          </Row>
        </LoginContainer>
      </Modal>
    </AppHeader>
  );
};

export default Header;
