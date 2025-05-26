import React, { useState, useRef, useEffect } from "react";
import '../css/Header.css'
import logo from "../assets/logo/logocronos.png";
import MateriasDropdown from './MateriasDropdown';
import Search from './Searchbox';
import NotifIcon from './NotfIcon';
import { FaUser, FaBars, FaTimes, FaLayerGroup, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserDropdown from './UserDropdown';


const Header = ({ navegarParaMateria, voltarParaMain, user, onLogout }) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef();
  const hamburguerRef = useRef();
  const userMenuRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuAberto(!menuAberto);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuAberto && menuRef.current && !menuRef.current.contains(event.target) &&
          hamburguerRef.current && !hamburguerRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuAberto, userMenuOpen]);

  return (
    <header className="navbar">
      <div className="nav-left">
        <img className="logo" src={logo} alt="logo do projeto" onClick={voltarParaMain} />
        <div className="desktop-nav">
          <MateriasDropdown navegarParaMateria={navegarParaMateria} />
          <button className="button-nav"><FaLayerGroup /> Flashcards</button>
          <button className="button-nav"><FaFileAlt /> Resumos</button>
        </div>
      </div>

      <button className="menu-hamburguer" onClick={toggleMenu} ref={hamburguerRef}>
        {menuAberto ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`mobile-nav ${menuAberto ? 'active' : ''}`} ref={menuRef}>
        <MateriasDropdown navegarParaMateria={navegarParaMateria} />
        <button><FaLayerGroup /> Flashcards</button>
        <button><FaFileAlt /> Resumos</button>
      </div>

      <div className="nav-right">
        <Search />
        <NotifIcon />
               <UserDropdown onLogout={onLogout} />

       
      </div>
    </header>
  );
};

export default Header;
