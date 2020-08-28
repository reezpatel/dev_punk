import styled from 'styled-components';

const WebsiteContainer = styled.div`
  background-color: #f6f5fa;
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: bold;
  color: #5f575e;
  padding: 24px;
`;

const WebsiteItem = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: 30px auto;
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

export { WebsiteContainer, Title, WebsiteItem, WebsiteIcon, WebsiteText };
