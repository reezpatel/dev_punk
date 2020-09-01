import styled from 'styled-components';

const AppHeader = styled.header`
  padding: 16px;
  display: flex;
  align-item: center;
  background-color: #2e3143;
`;

const AppIcon = styled.img`
  height: 36px;
  margin-right: 30px;
`;

const AppHeading = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: white;
  letter-spacing: 1.2px;
`;

const HeaderOptions = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const HeaderOption = styled.a`
  color: white;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 17px;
  font-weight: bold;
  letter-spacing: 1px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const AppLogo = styled.img``;

const LoginText = styled.p`
  font-size: 14px;
`;

const LoginWrapper = styled.div`
  flex-grow: 1;
  text-align: center;
  margin: 50px 0;
  display: flex;
  justify-content: center;
`;

const LoginButton = styled.button`
  background-color: black;
  color: white;
  border-radius: 7px;
  padding: 12px 15px;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  outline: none;
`;

const LoginLink = styled.a`
  text-align: center;
  font-size: 12px;
  color: gray;
`;

const LoginTitle = styled.h5`
  font-size: 32px;
`;

export {
  AppHeader,
  AppIcon,
  AppHeading,
  HeaderOptions,
  HeaderOption,
  LoginContainer,
  AppLogo,
  LoginText,
  LoginLink,
  LoginButton,
  LoginTitle,
  LoginWrapper,
};
