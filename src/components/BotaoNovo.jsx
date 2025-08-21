import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../css/BotaoNovo.css"; // ✅ importa o CSS correto

function BotaoNovo({ rota, texto = "Novo" }) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(rota)} className="btn-adicionar">
      <FontAwesomeIcon icon={faPlus} /> {texto}
    </button>
  );
}

export default BotaoNovo;
