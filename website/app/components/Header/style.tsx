import styled from 'styled-components';

const AppHeader = styled.header`
  padding: 16px;
  display: flex;
  align-item: center;
  background-color: #2e3143;
`;

const AppIcon = styled.img`
  height: 36px;
  margin-right: 30px;
`;

const AppHeading = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: white;
  letter-spacing: 1.2px;
`;

export { AppHeader, AppIcon, AppHeading };
