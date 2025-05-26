import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faGlobe, faBook, faLandmark, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../css/dropdown.css';

const MateriasDropdown = ({ navegarParaMateria }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const toggleRef = useRef();
  
  const materias = [
    { id: 1, nome: 'Filosofia', icone: faBook },
    { id: 2, nome: 'Geografia', icone: faGlobe },
    { id: 3, nome: 'História', icone: faLandmark },
    { id: 4, nome: 'Sociologia', icone: faUsers }
  ]

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMateriaClick = (materia) => {
    navegarParaMateria({ nome: materia });
    setIsOpen(false);
  };

  // Fecha o dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          toggleRef.current &&
          !toggleRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="materias-dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-toggle" 
        onClick={toggleDropdown}
        ref={toggleRef}
      >
        Matérias
        <FontAwesomeIcon 
          icon={isOpen ? faChevronUp : faChevronDown} 
          className="dropdown-icon" 
        />
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
         {materias.map(materia => (
          <div
            key={materia.id}
            className="materia-item"
            onClick={() => navegarParaMateria(materia)}
          >
              <FontAwesomeIcon icon={materia.icone} className="materia-icon" />
            <span>{materia.nome}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MateriasDropdown;