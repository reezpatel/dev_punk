import React, { Fragment } from 'react';
import { MdClose } from 'react-icons/md';
import {
  Wrapper,
  Container,
  Header,
  Title,
  CloseButton,
  ModalContent,
} from './style';

interface ModalProps {
  isOpen: boolean;
  children: JSX.Element;
  title: string;
  onClose: () => void;
}

type Modal = (props: ModalProps) => JSX.Element;

const Modal: Modal = ({ isOpen, title, children, onClose }) => {
  return isOpen ? (
    <Wrapper>
      <Container>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>
            <MdClose fontSize="22" />
          </CloseButton>
        </Header>
        <ModalContent>{children}</ModalContent>
      </Container>
    </Wrapper>
  ) : (
    <Fragment />
  );
};

export default Modal;
