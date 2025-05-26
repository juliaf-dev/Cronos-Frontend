import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '../css/search.css';

const Searchbox = () => {
  return (
    <div className="Seach">
      <input type="text" placeholder="Pesquisar " aria-label="Pesquisar" />
      <button aria-label="Pesquisar">
        <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
      </button>
    </div>
  );
};

export default Searchbox;
