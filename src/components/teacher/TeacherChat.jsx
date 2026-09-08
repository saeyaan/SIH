import React, { useState } from 'react';
import Card from '../Card';
import Button from '../Button';
import { Send, User } from 'lucide-react';

const TeacherChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Ravi', text: 'Good morning teacher! I had a question about yesterday\'s science lesson.', isTeacher: false },
    { id: 2, sender: 'You', text: 'Good morning Ravi! Sure, what is your question?', isTeacher: true },
    { id: 3, sender: 'Ravi', text: 'How many planets are there in the solar system?', isTeacher: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: 'You',
      text: newMessage,
      isTeacher: true
    }]);
    setNewMessage('');
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '600px', maxWidth: '800px', margin: '0 auto', padding: '0' }}>
      <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-card)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={20} /> Class 4 - General Discussion
        </h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', background: 'var(--color-bg-main)' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ alignSelf: msg.isTeacher ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px', display: 'block', textAlign: msg.isTeacher ? 'right' : 'left' }}>
              {msg.sender}
            </span>
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)', 
              background: msg.isTeacher ? 'var(--color-primary)' : 'var(--color-bg-card)',
              color: msg.isTeacher ? 'white' : 'var(--color-text-main)',
              boxShadow: 'var(--shadow-neu-outer-sm)',
              borderBottomRightRadius: msg.isTeacher ? '0' : 'var(--radius-md)',
              borderBottomLeftRadius: !msg.isTeacher ? '0' : 'var(--radius-md)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-bg-card)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button variant="primary" type="submit" style={{ padding: '10px 16px' }}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default TeacherChat;
