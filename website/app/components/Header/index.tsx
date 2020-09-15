import React, { useState } from 'react';
import { RiMenuLine } from 'react-icons/ri';
import { AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import {
  AppHeader,
  AppIcon,
  AppHeading,
  HeaderOption,
  HeaderOptions
} from './style';
import Icon from '../../assets/logo.png';
import Modal from '../Modal';
import { useUserContext } from '../../context';
import Login from '../Login';

interface HeaderProps {
  showMenuIcon: boolean;
  onMenuClick: (showMenu: boolean) => void;
}

type Header = (props: HeaderProps) => JSX.Element;

const Header: Header = ({ showMenuIcon, onMenuClick }) => {
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
    user.logout();
  };

  const handleMenuClick = () => {
    onMenuClick(!isOpen);
  };

  return (
    <AppHeader>
      <RiMenuLine
        onClick={handleMenuClick}
        color="white"
        size="24"
        cursor="pointer"
        visibility={showMenuIcon ? '' : 'hidden'}
      />
      <AppIcon src={Icon} />
      <AppHeading>{process.env.APPLICATION_NAME}</AppHeading>
      <HeaderOptions>
        {user.user.isLoggedIn ? (
          <HeaderOption onClick={handleLogout}>
            <AiOutlineLogout color="white" size="24" cursor="pointer" />
          </HeaderOption>
        ) : (
          <HeaderOption onClick={handleModalOpen}>
            <AiOutlineLogin color="white" size="24" cursor="pointer" />
          </HeaderOption>
        )}
      </HeaderOptions>
      <Modal onClose={handleModalClose} isOpen={isOpen} title="Login">
        <Login onLogin={handleLoginButtonClick} />
      </Modal>
    </AppHeader>
  );
};

export default Header;
