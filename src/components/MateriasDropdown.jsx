// src/components/MateriasDropdown.jsx
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBrain,
  faGlobe,
  faLandmark,
  faUsers,
  faCheckCircle,
  faClock,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import "../css/dropdown.css";
import { API_BASE_URL } from "../config/config";

const icones = {
  Filosofia: faBook,
  Geografia: faGlobe,
  História: faLandmark,
  Sociologia: faUsers,
  Psicologia: faBrain,
  Revisão: faCheckCircle,
  Tempo: faClock,
};

const MateriasDropdown = ({ navegarParaMateria }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [materias, setMaterias] = useState([]);
  const dropdownRef = useRef();
  const toggleRef = useRef();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleMateriaClick = (materia) => {
    if (!materia.id && !materia.materia_id) {
      console.error("❌ Matéria sem id válido:", materia);
      return;
    }

    // ✅ passa o objeto inteiro (igual ao Main.jsx)
    navegarParaMateria(materia);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE_URL}/api/materias`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setMaterias(data);
        } else if (data.ok && Array.isArray(data.data)) {
          setMaterias(data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar matérias:", error);
      }
    };

    fetchMaterias();
  }, []);

  // Fecha dropdown ao clicar fora
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          {materias.length > 0 ? (
            materias.map((materia) => (
              <div
                key={materia.id || materia.materia_id}
                className="materia-item"
                onClick={() => handleMateriaClick(materia)}
              >
                <FontAwesomeIcon
                  icon={icones[materia.nome] || faBook}
                  className="materia-icon"
                />
                <span className="materia-nome">{materia.nome}</span>
              </div>
            ))
          ) : (
            <div className="materia-item">Nenhuma matéria cadastrada</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MateriasDropdown;
