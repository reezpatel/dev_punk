import styled from 'styled-components';

const Container = styled.div`
  padding: 25px;
`;

const WebsiteInfo = styled.div`
  background-color: #f6f5fa;
  padding: 25px;
  border-radius: 17px;
`;
const WebsiteDetailsContainer = styled.div``;
const WebsiteTitle = styled.p`
  font-weight: bold;
  font-size: 22px;
`;
const WebsiteLink = styled.p`
  font-size: 12px;
`;
const WebsiteActions = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-items: end;
`;
const WebsiteActionEdit = styled.button`
  background-color: #6200ff;
  outline: none;
  border: none;
  height: 54px;
  width: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  cursor: pointer;

  &:hover {
    background-color: #5500de;
  }
`;
const WebsiteActionDelete = styled.button`
  background-color: #ff0100;
  outline: none;
  border: none;
  height: 54px;
  width: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  cursor: pointer;

  &:hover {
    background-color: #d40100;
  }
`;

export {
  Container,
  WebsiteInfo,
  WebsiteDetailsContainer,
  WebsiteTitle,
  WebsiteLink,
  WebsiteActions,
  WebsiteActionEdit,
  WebsiteActionDelete
};
