import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '../css/search.css';

const Searchbox = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`Seach ${isExpanded ? 'expanded' : ''}`} ref={searchRef}>
      <input 
        type="text" 
        placeholder={isExpanded ? "Pesquisar" : ""} 
        aria-label="Pesquisar"
        onFocus={() => setIsExpanded(true)}
      />
      <button 
        aria-label="Pesquisar"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
      </button>
    </div>
  );
};

export default Searchbox;
