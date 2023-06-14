import React from "react";

const SearchBar = ({ search, handleSearch }) => {
  return (
    <>
      <input
        className="searching"
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by name, email, or role"
      />
      <br />
    </>
  );
};

export default SearchBar;
