// import React from 'react';
import styled from 'styled-components';

interface RowProps {
  size: string;
  children: JSX.Element | JSX.Element[];
  gap?: string;
}

const Row = styled.div<RowProps>`
  display: grid;
  grid-template-columns: ${(props) => props.size};
  grid-column-gap: ${(props) => props.gap || '0'};
  align-items: flex-start;
`;

export { Row };
