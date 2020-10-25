import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { SearchContainer, Bar, SearchInput } from './styles';

interface SearchBarProps {
  onChange: (str: string) => void;
}

type SearchBar = (props: SearchBarProps) => JSX.Element;

const SearchBar: SearchBar = ({ onChange }): JSX.Element => {
  const [input, setInput] = useState('ewfwefew');

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const clearInput = () => {
    onChange('');
    setInput('');
  };

  const handleSubmit = () => {
    onChange(input);
  };

  return (
    <SearchContainer>
      <Bar>
        <AiOutlineFileSearch size="22px" color="#868686" />
        <SearchInput
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Type in to Search..."
        />
        {input && (
          <>
            <FaSearch cursor="pointer" onClick={handleSubmit} color="#868686" />
            <IoMdClose cursor="pointer" onClick={clearInput} color="#868686" />
          </>
        )}
      </Bar>
    </SearchContainer>
  );
};

export default SearchBar;
