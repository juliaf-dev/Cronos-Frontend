// src/components/BotaoVoltar.jsx
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../css/BotaoVoltar.css"; // ✅ importa o CSS correto

function BotaoVoltar({ onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // usa a função customizada (ex: voltar para lista de matérias)
    } else {
      navigate(-1); // padrão: volta no histórico
    }
  };

  return (
   <button onClick={handleClick} className="botao-voltar">
  <FontAwesomeIcon icon={faArrowLeft} /> Voltar
</button>

  );
}

export default BotaoVoltar;
