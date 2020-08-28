import React from 'react';
import { AppHeader, AppIcon, AppHeading } from './style';
import Icon from '../../assets/logo.png';

const Header = () => {
  return (
    <AppHeader>
      <AppIcon src={Icon}></AppIcon>
      <AppHeading>Devpunk</AppHeading>
    </AppHeader>
  );
};

export default Header;
