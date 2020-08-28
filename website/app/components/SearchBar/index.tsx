import React, { useState } from 'react';
import { SearchContainer, Bar, SearchInput } from './styles';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const SearchBar = () => {
  const [input, setInput] = useState('');

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const clearInput = () => {
    setInput('');
  };

  return (
    <SearchContainer>
      <Bar>
        <FaSearch color="#868686" />
        <SearchInput
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Type in to Search..."
        />
        {input && (
          <IoMdClose cursor="pointer" onClick={clearInput} color="#868686" />
        )}
      </Bar>
    </SearchContainer>
  );
};

export default SearchBar;
