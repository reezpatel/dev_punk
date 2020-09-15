import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const Container = styled.div`
  background-color: white;
  width: 660px;
  min-height: 380px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  max-width: 90vw;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  height: 38px;
  padding: 10px 25px;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const CloseButton = styled.button`
  outline: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-item: center;
`;

const Title = styled.h5`
  font-size: 20px;
`;

const ModalContent = styled.div`
  padding: 15px 25px;
  flex-grow: 1;
`;

export { ModalContent, Title, CloseButton, Header, Container, Wrapper };
