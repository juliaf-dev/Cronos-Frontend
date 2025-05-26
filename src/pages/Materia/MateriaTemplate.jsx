import { useState } from 'react';
import './MateriaTemplate.css';

const MateriaTemplate = ({ 
  voltarParaMain, 
  navegarParaConteudo, 
  titulo, 
  itens,
  corPrimaria,
  corSecundaria,
  corTexto
}) => {
  const [itemExpandido, setItemExpandido] = useState(null);

  const toggleSubitens = (itemId) => {
    setItemExpandido(itemId === itemExpandido ? null : itemId);
  };

  return (
    <div className="materia-body">
    <div className="materia-container">
      <button onClick={voltarParaMain} className="botao-voltar" style={{ backgroundColor: corPrimaria }}>
        ← Voltar
      </button>
      
      <h1 style={{ color: corTexto, borderBottom: `2px solid ${corSecundaria}` }}>{titulo}</h1>
      
      <div className="itens-lista">
        {itens.map((item) => (
          <div key={item.id} className="item-card">
            <h2 
              onClick={() => toggleSubitens(item.id)}
              style={{ 
                backgroundColor: corSecundaria,
                color: corTexto
              }}
            >
              {item.nome} {itemExpandido === item.id ? '▼' : '►'}
            </h2>
            
            {itemExpandido === item.id && (
              <ul className="subitens-lista">
                {item.subitens.map((subitem, index) => (
                  <li 
                    key={index}
                    style={{ backgroundColor: corSecundaria + '20' }} /* 20 = 12% de opacity */
                    onClick={() => navegarParaConteudo({
                      id: item.id,
                      nome: `${item.nome} - ${subitem}`
                    })}
                  >
                    {subitem}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
     </div>
  );
};

export default MateriaTemplate;