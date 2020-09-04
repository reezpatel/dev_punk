import React from 'react';
import { FaGithub } from 'react-icons/fa';
import {
  LoginContainer,
  LoginText,
  LoginLink,
  LoginButton,
  LoginTitle,
  LoginWrapper
} from './styles';
import { Row } from '../UI';

interface LoginProps {
  onLogin: () => void;
}

type Login = (props: LoginProps) => JSX.Element;

const Login: Login = ({ onLogin }): JSX.Element => {
  return (
    <LoginContainer>
      <LoginTitle>Hello There, </LoginTitle>
      <LoginText>Login into Devpunk using you social account.</LoginText>
      <LoginWrapper>
        <LoginButton onClick={onLogin}>
          <FaGithub size="24" /> &nbsp; &nbsp; Login with Github
        </LoginButton>
      </LoginWrapper>
      <Row size="1fr 1fr">
        <LoginLink href="#">Privacy Policy</LoginLink>
        <LoginLink href="#">Terms &amp; Conditions</LoginLink>
      </Row>
    </LoginContainer>
  );
};

export default Login;
