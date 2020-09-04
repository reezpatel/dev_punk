import styled from 'styled-components';

const AppHeader = styled.header`
  padding: 16px;
  display: grid;
  align-item: center;
  background-color: #2e3143;
  grid-template-columns: 40px 55px 150px 1fr;
  align-items: center;
  justify-items: center;
`;

const AppIcon = styled.img`
  height: 36px;
`;

const AppHeading = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: white;
  letter-spacing: 1.2px;
`;

const HeaderOptions = styled.div`
  justify-self: end;
`;

const HeaderOption = styled.a`
  display: grid;
  align-items: center;
`;

export { AppHeader, AppIcon, AppHeading, HeaderOptions, HeaderOption };
