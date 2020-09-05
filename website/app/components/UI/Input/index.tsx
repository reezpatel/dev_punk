import React, { useState, useEffect } from 'react';
import { InputContainer, Label, Input } from './styles';

interface TextInputProps {
  label: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}
type TextInput = (props: TextInputProps) => JSX.Element;

const TextInput: TextInput = ({ label, value, onChange }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const handleOnBlur = () => {
    if (!value) {
      setShowPlaceholder(true);
    }
  };

  const handleOnFocus = () => {
    setShowPlaceholder(false);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    if (value) {
      setShowPlaceholder(false);
    }
  }, [value]);

  return (
    <InputContainer>
      <Label focus={showPlaceholder}>{label}</Label>
      <Input
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        type="text"
        value={value}
        onChange={handleChange}
      />
    </InputContainer>
  );
};

// eslint-disable-next-line import/prefer-default-export
export { TextInput };
