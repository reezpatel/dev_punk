import styled from 'styled-components';

const InputContainer = styled.div`
  position: relative;
  margin: 25px 0 0;
  width: 100%;
  display: flex;

  &:focus-with {
    width: 20%;
  }
`;

const Input = styled.input`
  background-color: #f6f5fa;
  outline: none;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  flex-grow: 1;
  font-size: 12px;
`;

const Label = styled.span<{ focus: boolean }>`
  position: absolute;
  font-size: ${(prop) => (prop.focus ? '12px' : '10px')};
  left: ${(prop) => (prop.focus ? '14px' : '0px')};
  top: ${(prop) => (prop.focus ? '8px' : '-17px')};
  transition: all 0.13s linear;
`;

export { InputContainer, Input, Label };
