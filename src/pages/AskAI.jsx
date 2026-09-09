import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { getChatbotResponse } from '../utils/chatbotEngine';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Send, Trash2, Bot, User, Loader2 } from 'lucide-react';

const AskAI = () => {
  const { t, uiLanguage } = useLanguage();
  
  const getInitialMessages = () => {
    const saved = localStorage.getItem('bhashasetu_askai_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      { id: 1, type: 'ai', text: 'Hello! I am BhashaSetu AI. What would you like to learn today? 😊', sender: 'ai' }
    ];
  };

  const [messages, setMessages] = useState(getInitialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const { addToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('bhashasetu_askai_chat', JSON.stringify(messages));
  }, [messages, isTyping]);

  const handleAsk = (question) => {
    if (!question.trim()) {
      addToast('Please enter a question.', 'warning');
      return;
    }

    const newMsg = { id: Date.now(), type: 'user', text: question, sender: 'user' };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const responseText = getChatbotResponse(question, uiLanguage);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: responseText, sender: 'ai' }]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isTyping) handleAsk(input);
    }
  };

  const handleClear = () => {
    const initial = [{ id: 1, type: 'ai', text: `${t('askai.cleared') || 'Conversation cleared.'} How can I help you now? 😊`, sender: 'ai' }];
    setMessages(initial);
    setShowClearConfirm(false);
    addToast(t('askai.cleared') || 'Cleared', 'success');
  };

  const suggestions = [
    "5 + 7 = ?",
    "What is a noun?",
    "What is photosynthesis?",
    "What are fractions?",
    "Why do we need water?"
  ];

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <div>
            <h2 style={{ color: 'var(--color-primary-dark)', margin: 0 }}>{t('askai.title') || 'Ask AI'}</h2>
            <p style={{ margin: 0, fontSize: 'var(--fs-small)' }}>{t('askai.subtitle') || 'Learn anything, simply.'}</p>
          </div>
          <button 
            onClick={() => setShowClearConfirm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--color-bg-input)', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontWeight: 'bold', padding: '8px 12px', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-neu-outer-sm)' }}
          >
            <Trash2 size={16} /> <span className="hide-on-mobile">{t('askai.clear') || 'Clear'}</span>
          </button>
        </div>

        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 'var(--spacing-sm)' }}>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ 
                display: 'flex', 
                gap: '12px', 
                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '90%' 
              }}>
                {msg.type === 'ai' && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-neu-outer-sm)' }}>
                    <Bot size={22} color="white" />
                  </div>
                )}
                <div style={{ 
                  background: msg.type === 'user' ? 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))' : 'var(--color-bg-input)', 
                  color: msg.type === 'user' ? 'white' : 'var(--color-text-main)',
                  padding: '12px 18px', 
                  borderRadius: msg.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  boxShadow: msg.type === 'user' ? '0 4px 15px rgba(88,86,214,0.3)' : 'var(--shadow-neu-outer-sm)',
                  border: msg.type === 'user' ? 'none' : '1px solid white',
                  fontSize: 'var(--fs-body)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>
                {msg.type === 'user' && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-neu-outer-sm)', border: '1px solid white' }}>
                    <User size={22} color="var(--color-primary)" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-neu-outer-sm)' }}>
                  <Bot size={22} color="white" />
                </div>
                <div style={{ background: 'var(--color-bg-input)', padding: '12px 18px', borderRadius: '20px 20px 20px 4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', border: '1px solid white', boxShadow: 'var(--shadow-neu-outer-sm)' }}>
                  <Loader2 size={18} className="spin-animation" /> {t('askai.thinking') || 'Thinking...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }} className="hide-scrollbar">
              {suggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => !isTyping && handleAsk(s)}
                  disabled={isTyping}
                  style={{ padding: '8px 16px', background: 'var(--color-bg-card)', color: 'var(--color-primary-dark)', border: '1px solid white', borderRadius: 'var(--radius-full)', cursor: isTyping ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', fontSize: 'var(--fs-small)', fontWeight: 600, boxShadow: 'var(--shadow-neu-outer-sm)', opacity: isTyping ? 0.5 : 1, transition: 'opacity 0.2s' }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', background: 'var(--color-bg-input)', padding: '6px', borderRadius: '20px', boxShadow: 'var(--shadow-neu-inner)' }}>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('askai.placeholder') || 'Type your question...'} 
                style={{ flex: 1, padding: '12px 20px', borderRadius: '20px', border: 'none', outline: 'none', background: 'transparent', fontSize: 'var(--fs-body)', resize: 'none', minHeight: '24px' }}
                disabled={isTyping}
                rows={1}
              />
              <Button variant="primary" onClick={() => handleAsk(input)} disabled={isTyping || !input.trim()} style={{ padding: '0 24px', borderRadius: 'var(--radius-full)', minHeight: '44px' }}>
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear Conversation?">
        <p>Are you sure you want to clear your conversation history? This cannot be undone.</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="secondary" onClick={() => setShowClearConfirm(false)} style={{ flex: 1 }}>Cancel</Button>
          <Button variant="primary" onClick={handleClear} style={{ flex: 1, background: 'var(--color-danger)' }}>{t('askai.clear') || 'Clear'}</Button>
        </div>
      </Modal>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 600px) {
          .hide-on-mobile { display: none; }
        }
      `}</style>
    </>
  );
};

export default AskAI;
