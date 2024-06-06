import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // updated for react-router-dom v6+
import './Search.css';

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate(); // react-router-dom v6+ hook

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`); // updated for react-router-dom v6+
    } else {
      navigate("/products");
    }
  };

  return (
    <form className='searchBox' onSubmit={searchSubmitHandler}>
      <input 
        type="text" 
        placeholder='Search a Product...' 
        onChange={(e) => setKeyword(e.target.value)} 
        aria-label="Search Products"
      />
      <input 
        type="submit" 
        value="Search" 
        disabled={!keyword.trim()} // disable button if keyword is empty
      />
    </form>
  );
}

export default Search;
