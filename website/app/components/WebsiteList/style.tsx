import styled from 'styled-components';

const WebsiteContainer = styled.div<{ visible: boolean }>`
  background-color: #f6f5fa;
  display: grid;
  grid-template-rows: 90px 1fr;
  left: ${(prop) => (prop.visible ? '0' : '-300px')};
  position: absolute;
  width: 300px;
  transition: all 0.3s linear;
  top: 0;
  bottom: 0;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  z-index: 4;

  @media screen and (max-width: 600px) {
    grid-template-rows: 60px 1fr;
  }
`;

const WebsiteListContainer = styled.div`
  overflow: scroll;
  height: calc(100vh - 141px);

  @media screen and (max-width: 600px) {
    height: calc(100vh - 121px);
    padding-bottom: 10px;
  }
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: bold;
  color: #5f575e;
  padding: 24px;

  @media screen and (max-width: 600px) {
    padding: 10px 24px;
    font-size: 25px;
  }
`;

const WebsiteItem = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: 30px auto 24px;
  column-gap: 10px;
  align-items: center;
  cursor: pointer;
  padding: 8px 24px;
  background-color: ${(props) => (props.selected ? '#ececec' : '')};
  color: #5f575e;

  &:hover {
    background-color: #ececec;
  }
`;

const WebsiteIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const WebsiteText = styled.span`
  font-weight: bold;
`;

const WebsiteAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  height: 24px;

  &:hover {
    background-color: #dcdbdb;
  }
`;

export {
  WebsiteContainer,
  WebsiteListContainer,
  Title,
  WebsiteItem,
  WebsiteIcon,
  WebsiteText,
  WebsiteAction
};
