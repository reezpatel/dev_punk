import React, { useState } from 'react';
import {
  InputContainer,
  Label,
  Option,
  OptionContainer,
  Select,
} from './style';

interface SelectProps {
  label: string;
  value: string;
  options: {
    name: string;
    value: string;
  }[];
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

type SelectInput = (props: SelectProps) => JSX.Element;

const SelectInput: SelectInput = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelection = (e) => () => {
    onChange(e);
    setOpen(false);
  };

  const toggleModal = () => {
    setOpen(!open);
  };

  const getSelectedValue = () => {
    const option = options.find((o) => o.value === value);
    if (option) {
      return option.name;
    }
    return options[0].name;
  };

  return (
    <InputContainer>
      <Label>{label}</Label>
      <Select>
        <Option selected key="__default__" onClick={toggleModal}>
          {getSelectedValue()}
        </Option>
        {open && (
          <OptionContainer>
            {options.map((option) => (
              <Option
                selected={false}
                key={option.name}
                onClick={handleSelection(option.value)}
              >
                {option.name}
              </Option>
            ))}
          </OptionContainer>
        )}
      </Select>
    </InputContainer>
  );
};

export { SelectInput };
