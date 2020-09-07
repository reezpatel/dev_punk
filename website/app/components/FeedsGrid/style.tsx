import styled from 'styled-components';

const FeedsContainer = styled.div<{ columns: number }>`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 4fr);
  column-gap: 15px;
  overflow: scroll;
  padding: 25px;
`;

const FeedColumns = styled.div``;

const FeedBlock = styled.div`
  background-color: #f6f5fa;
  margin-bottom: 15px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const FeedImage = styled.img`
  width: 100%;
  min-height: 120px;
`;

const FeedDetails = styled.div`
  padding: 8px 15px;
`;

const FeedsTitle = styled.p`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.4px;
  line-height: 24px;
  color: #3c3c3c;
`;

const FeedsMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 25px;
  margin-top: 18px;
`;

const FeedMetaTitle = styled.p`
  font-size: 12px;
  color: #909090;
  font-weight: 400;
`;

const FeedMetaAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  height: 25px;
  &:hover {
    background-color: #dcdbdb;
  }
`;

export {
  FeedsContainer,
  FeedColumns,
  FeedBlock,
  FeedImage,
  FeedDetails,
  FeedsTitle,
  FeedsMeta,
  FeedMetaTitle,
  FeedMetaAction
};
