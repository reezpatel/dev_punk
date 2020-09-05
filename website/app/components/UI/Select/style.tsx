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

const Select = styled.ul`
  background-color: #f6f5fa;
  outline: none;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  flex-grow: 1;
  font-size: 12px;
  list-style: none;
  position: relative;
`;

const Label = styled.span`
  position: absolute;
  font-size: 10px;
  left: 0;
  top: -17px;
  transition: all 0.13s linear;
`;

interface OptionProps {
  selected: boolean;
}

const Option = styled.li<OptionProps>`
  cursor: pointer;
  margin: ${(prop) => (prop.selected ? '0' : '10px')} 0;
`;

const OptionContainer = styled.div`
  position: absolute;
  top: 37px;
  background-color: #f6f5fa;
  border-radius: 8px;
  padding: 8px 14px;
  left: 0;
  right: 0;
`;

export { InputContainer, Select, Label, Option, OptionContainer, OptionProps };
