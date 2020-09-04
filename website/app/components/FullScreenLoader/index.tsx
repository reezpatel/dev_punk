import React from 'react';
import styled from 'styled-components';

import LoadingIcon from '../../assets/loading.gif';
import colors from '../../utils/colors';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  align-items: center;
  justify-items: center;
  background-color: ${colors.darkBgColor};
`;

const LoadingImage = styled.img`
  max-width: 70vw;
`;

const FullScreenLoader = (): JSX.Element => {
  return (
    <Container>
      <LoadingImage src={LoadingIcon} />
    </Container>
  );
};

export default FullScreenLoader;
