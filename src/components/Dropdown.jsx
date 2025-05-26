// src/components/Dropdown.jsx
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../css/dropdown.css';

const Dropdown = ({ titulo = "Selecionar", itens = [], onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const toggleRef = useRef();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    onItemClick(item);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="materias-dropdown" ref={dropdownRef}>
      <button
        className="dropdown-toggle"
        onClick={toggleDropdown}
        ref={toggleRef}
      >
        {titulo}
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="dropdown-icon"
        />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {itens.map((item) => (
            <div
              key={item.id}
              className="materia-item"
              onClick={() => handleItemClick(item)}
            >
              {item.icone && <FontAwesomeIcon icon={item.icone} className="materia-icon" />}
              <span>{item.nome}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
