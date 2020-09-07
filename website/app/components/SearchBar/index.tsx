import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { SearchContainer, Bar, SearchInput } from './styles';

interface SearchBarProps {
  value: string;
  onChange: (str: string) => void;
}

type SearchBar = (props: SearchBarProps) => JSX.Element;

const SearchBar: SearchBar = ({ value, onChange }): JSX.Element => {
  const handleInput = (e) => {
    onChange(e.target.value);
  };

  const clearInput = () => {
    onChange('');
  };

  return (
    <SearchContainer>
      <Bar>
        <FaSearch color="#868686" />
        <SearchInput
          type="text"
          value={value}
          onChange={handleInput}
          placeholder="Type in to Search..."
        />
        {value && (
          <IoMdClose cursor="pointer" onClick={clearInput} color="#868686" />
        )}
      </Bar>
    </SearchContainer>
  );
};

export default SearchBar;
