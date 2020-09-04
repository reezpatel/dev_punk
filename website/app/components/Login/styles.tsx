import styled from 'styled-components';

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
  LoginContainer,
  AppLogo,
  LoginText,
  LoginLink,
  LoginButton,
  LoginTitle,
  LoginWrapper
};
