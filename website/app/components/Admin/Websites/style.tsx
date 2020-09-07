import styled from 'styled-components';

const Container = styled.div`
  background-color: #f6f5fa;
  color: #3b4246;
  overflow: hidden;
`;

const Heading = styled.h4`
  font-weight: 800;
`;

const NewButton = styled.button`
  background-color: #ff9400;
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
    background-color: #e88906;
  }
`;

const HeadSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
`;

const ContentSection = styled.div`
  height: calc(100vh - 171px);
  overflow-y: scroll;
  overflow-x: hidden;
`;

const EmptyBlock = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const EmptyBlockImg = styled.img`
  width: 100px;
  opacity: 60%;
  margin-top: 80px;
`;
const EmptyBlockMessage = styled.p``;

const WebsiteBlock = styled.div<{ selected: boolean }>`
  border-bottom: 0.3px solid #e0e1ec;
  display: grid;
  grid-template-columns: 80px 1fr;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? '#e0e1ec' : '')};

  &:hover {
    background-color: #e0e1ec;
  }
`;

const WebsiteImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WebsiteImage = styled.img`
  width: 30px;
`;

const WebsiteDetailsContainer = styled.div`
  padding: 15px 0;
`;

const WebsiteTitle = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 16px;
`;

const WebsiteSubTitle = styled.p`
  margin: 0;
  font-size: 12px;
`;

export {
  WebsiteSubTitle,
  WebsiteTitle,
  WebsiteDetailsContainer,
  WebsiteImage,
  WebsiteImageContainer,
  WebsiteBlock,
  EmptyBlockMessage,
  EmptyBlockImg,
  EmptyBlock,
  HeadSection,
  ContentSection,
  NewButton,
  Heading,
  Container
};
