// src/components/UserDropdown.jsx
import { faUser, faChartLine, faHeadset, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useAuth } from "../context/AuthContext"; // pega do contexto

const UserDropdown = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth(); // agora vem do contexto

  const opcoes = [
    { id: 1, nome: "Perfil", icone: faUser, acao: () => navigate("/perfil") },
    { id: 2, nome: "Evolução", icone: faChartLine, acao: () => navigate("/evolucao") },
    { id: 3, nome: "Suporte", icone: faHeadset, acao: () => navigate("/suporte") },
    { id: 4, nome: "Sair", icone: faSignOutAlt, acao: handleLogout },
  ];

  const handleClick = (opcao) => {
    if (opcao.acao) opcao.acao();
  };

  return (
    <Dropdown
      titulo={user?.nome || "Usuário"} // mostra nome do usuário se existir
      itens={opcoes}
      onItemClick={handleClick}
    />
  );
};

export default UserDropdown;
