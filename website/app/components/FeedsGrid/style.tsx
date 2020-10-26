import styled from 'styled-components';

const FeedWrapper = styled.div`
  margin-top: 20px;
  position: relative;

  @media screen and (max-width: 600px) {
    margin-top: 0px;
  }
`;

const FeedsContainer = styled.div`
  column-gap: 15px;
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(100vh - 219px);
  padding: 25px 15px 25px 15px;

  @media screen and (max-width: 600px) {
    padding: 0 10px;
    height: calc(100vh - 148px);
  }
`;

const FeedColumns = styled.div<{ columns: number }>`
  width: calc(100% / ${(props) => props.columns});
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
  padding: 10px;
`;

const FeedBlock = styled.div`
  background-color: #f6f5fa;
  margin-bottom: 15px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
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

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  justify-items: center;
  align-content: center;
`;

const NoResultHint = styled.span`
  color: #909090;
`;

export {
  FeedWrapper,
  FeedsContainer,
  FeedColumns,
  FeedBlock,
  FeedDetails,
  FeedsTitle,
  FeedsMeta,
  FeedMetaTitle,
  FeedMetaAction,
  LoaderWrapper,
  NoResultHint
};
