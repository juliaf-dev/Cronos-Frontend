import React, { useState, useRef, useEffect } from 'react';
import '../css/Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gerarRespostaIA } from '../services/geminiService';
import { faComments, faCircleXmark, faPaperPlane, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

function ChatAssistente({ materiaTopico }) {
  const [expandido, setExpandido] = useState(false);
  const [mensagens, setMensagens] = useState([
    { 
      origem: 'ia', 
      conteudo: materiaTopico 
        ? `Olá! Sou seu assistente de estudo. Posso te ajudar com alguma dúvida sobre o material?` 
        : `Olá! Sou seu assistente de estudo. Posso te ajudar com alguma dúvida?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);
  const [entrada, setEntrada] = useState("");
  const mensagensEndRef = useRef(null);

  const scrollToBottom = () => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!entrada.trim()) return;

    const novaMensagemUsuario = { 
      origem: 'usuario', 
      conteudo: entrada,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMensagens((msgs) => [...msgs, novaMensagemUsuario]);
    setEntrada("");

    // Extrai matéria e tópico se disponível
    let materia = null;
    let topico = null;
    if (materiaTopico) {
      [materia, topico] = materiaTopico.split(' - ');
    }

    try {
      const resposta = await gerarRespostaIA(entrada, materia, topico);
      const novaMensagemIA = { 
        origem: 'ia', 
        conteudo: formatarRespostaIA(resposta),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMensagens((msgs) => [...msgs, novaMensagemIA]);
    } catch (error) {
      const mensagemErro = {
        origem: 'ia',
        conteudo: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMensagens((msgs) => [...msgs, mensagemErro]);
    }
  };

  const formatarRespostaIA = (texto) => {
    // Formata listas com marcadores
    texto = texto.replace(/\n\s*•\s*/g, '\n• ');
    // Formata títulos ou ênfase
    texto = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Preserva quebras de linha
    return texto.split('\n').map((paragrafo, i) => 
      paragrafo.trim() ? `<p key=${i}>${paragrafo}</p>` : ''
    ).join('');
  };

  return (
    <div className={`chatia-container ${expandido ? "expandido" : ""}`}>
      {expandido ? (
        <div className="chat-box">
          <div className="chat-header">
            <button className="close-btn" onClick={() => setExpandido(false)}>
              <FontAwesomeIcon icon={faCircleXmark} className="toggle-icon"/>
            </button>
            <div className="chat-title">
              <span>Assistente de Estudos</span>
            
            </div>
          </div>
          
          <div className="chat-mensagens">
            {mensagens.map((msg, index) => (
              <div key={index} className={`mensagem ${msg.origem}`}>
                <div className="mensagem-conteudo">
                  {msg.origem === 'ia' && (
                    <div className="mensagem-cabecalho">
                      <FontAwesomeIcon icon={faUserGraduate} className="assistant-icon" />
                      <span>Assistente:</span>
                    </div>
                  )} 
                  <div 
                    className="mensagem-texto"   
                    dangerouslySetInnerHTML={{ __html: msg.conteudo }}
                  /> 
                  <span className="mensagem-hora">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={mensagensEndRef} />
          </div>
          
          <form onSubmit={enviarMensagem} className="chat-input-area">
            <input
              type="text"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder="Digite sua dúvida"
              className="chat-input"
              autoFocus
            />
            <button type="submit" className="send-btn">
              <FontAwesomeIcon icon={faPaperPlane} className="toggle-icon" />
            </button>
          </form>
        </div>
      ) : (
        <button className="chat-toggle" onClick={() => setExpandido(true)}>
          <FontAwesomeIcon icon={faComments} className="toggle-icon" />
          <span>Assistente de estudos</span>
        </button>
      )}
    </div>
  );
}

export default ChatAssistente;