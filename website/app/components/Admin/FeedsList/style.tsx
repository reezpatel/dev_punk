import styled from 'styled-components';

const Container = styled.div``;

const FeedsContainer = styled.div`
  margin: 15px 0;
  background-color: #f6f5fa;
`;

const FeedsImage = styled.img`
  width: 100%;
  min-width: 320px;
`;

const FeedDetails = styled.div`
  margin: 12px 0;
`;

const FeedTitle = styled.p`
  color: #3b4246;
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 5px;
`;

const FeedTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 25px;
`;

const FeedTag = styled.p`
  background-color: #f6f5fa;
  margin: 0 12px 0 0;
  padding: 5px 15px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 7px;
  margin-bottom: 10px;
`;

const FeedsMeta = styled.div`
  display: flex;
  margin: 10px 0;
  align-items: center;
`;

const FeedMetaIcon = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
`;

const FeedMetaText = styled.p`
  font-size: 14px;
  font-weight: 400;
`;

const FeedActionContainer = styled.div`
  align-self: center;
  justify-self: center;
`;

const FeedActionDelete = styled.button`
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
  FeedsContainer,
  FeedsImage,
  FeedDetails,
  FeedTitle,
  FeedTagContainer,
  FeedTag,
  FeedsMeta,
  FeedMetaIcon,
  FeedMetaText,
  FeedActionContainer,
  FeedActionDelete
};
