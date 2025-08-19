// src/components/UserDropdown.jsx
import { faUser, faChartLine, faHeadset, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // <- para o ícone do avatar
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useAuth } from "../context/AuthContext"; // pega do contexto
import "../css/userDropdown.css"; // <- CSS separado só para o visual do topo

const UserDropdown = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth(); // agora vem do contexto

  const opcoes = [
    { id: 1, nome: "Perfil", icone: faUser, acao: () => navigate("/perfil") },
    { id: 2, nome: "Evolução", icone: faChartLine, acao: () => navigate("/evolucao") }, // ✅ label com ç, rota sem ç
    { id: 3, nome: "Suporte", icone: faHeadset, acao: () => navigate("/suporte") },
    { id: 4, nome: "Sair", icone: faSignOutAlt, acao: handleLogout },
  ];

  const handleClick = (opcao) => {
    if (opcao.acao) opcao.acao();
  };

  // ✅ Título customizado: bolinha com ícone e nome que aparece no hover
  const tituloTopo = (
    <div className="ud-top" title={user?.nome || "Usuário"} aria-label="Menu do usuário">
      <div className="ud-avatar">
        <FontAwesomeIcon icon={faUser} />
      </div>
      <span className="ud-name">{user?.nome || "Usuário"}</span>
    </div>
  );

  return (
    <Dropdown
      titulo={tituloTopo}             // <- apenas mudamos a aparência do título
      itens={opcoes}
      onItemClick={handleClick}
    />
  );
};

export default UserDropdown;
