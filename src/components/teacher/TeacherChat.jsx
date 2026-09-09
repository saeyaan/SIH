import React, { useState, useEffect, useRef } from 'react';
import Card from '../Card';
import Button from '../Button';
import { Send, User } from 'lucide-react';
import { getMessages, addMessage, subscribeToChat } from '../../services/chatStore';

const TeacherChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(getMessages());
    const unsubscribe = subscribeToChat((msgs) => {
      setMessages(msgs);
    });
    return unsubscribe;
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    addMessage({
      sender: 'Teacher',
      text: newMessage,
      isTeacher: true
    });
    setNewMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '600px', maxWidth: '800px', margin: '0 auto', padding: '0' }}>
      <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-card)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={20} /> Student Interaction
        </h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', background: 'var(--color-bg-main)' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>No messages yet. Send a message to start the conversation!</div>
        ) : messages.map(msg => (
          <div key={msg.id} style={{ alignSelf: msg.isTeacher ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px', display: 'flex', justifyContent: msg.isTeacher ? 'flex-end' : 'flex-start', gap: '8px' }}>
              <span>{msg.sender}</span>
              <span style={{ opacity: 0.7 }}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </span>
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)', 
              background: msg.isTeacher ? 'var(--color-primary)' : 'var(--color-bg-card)',
              color: msg.isTeacher ? 'white' : 'var(--color-text-main)',
              boxShadow: 'var(--shadow-neu-outer-sm)',
              borderBottomRightRadius: msg.isTeacher ? '0' : 'var(--radius-md)',
              borderBottomLeftRadius: !msg.isTeacher ? '0' : 'var(--radius-md)',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-bg-card)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <textarea 
            className="input-field" 
            placeholder="Type your message... (Shift + Enter for new line)" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, resize: 'none', minHeight: '40px', paddingTop: '10px' }}
            rows={1}
          />
          <Button variant="primary" type="submit" style={{ padding: '10px 16px' }} disabled={!newMessage.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default TeacherChat;
