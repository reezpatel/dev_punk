import styled from 'styled-components';

const SearchContainer = styled.div``;

const Bar = styled.div`
  background-color: #f6f5fa;
  padding: 15px 20px;
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  border-radius: 25px;
  align-items: center;
  justify-items: center;
  column-gap: 15px;
  max-width: 720px;
`;

const SearchInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  background: none;
  font-size: 18px;
  color: #5f575e;
`;

export { SearchContainer, Bar, SearchInput };
