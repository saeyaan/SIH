import React, { useState } from 'react';
import Card from '../Card';
import Button from '../Button';
import { Bell, Calendar, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const TeacherReminders = () => {
  const { addToast } = useToast();
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Submit weekly progress report', date: '2024-05-15' },
    { id: 2, text: 'Grade Class 4 Science assignments', date: '2024-05-16' },
    { id: 3, text: 'Prepare slides for Solar System lesson', date: '2024-05-17' }
  ]);
  const [newText, setNewText] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newText.trim() || !newDate) return;
    
    setReminders([...reminders, {
      id: Date.now(),
      text: newText,
      date: newDate
    }]);
    setNewText('');
    setNewDate('');
    addToast('Reminder added successfully!', 'success');
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
    addToast('Reminder removed.', 'success');
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-xl)', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
      
      <Card style={{ flex: 1, minWidth: '300px', height: 'fit-content' }}>
        <h3 style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add New Reminder
        </h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div>
            <label className="form-label">Reminder Text</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Grade assignments..." 
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Date</label>
            <input 
              type="date" 
              className="input-field" 
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
              style={{ cursor: 'pointer' }}
            />
          </div>
          <Button variant="primary" type="submit" style={{ marginTop: '8px' }}>
            Add Reminder
          </Button>
        </form>
      </Card>

      <Card style={{ flex: 2, minWidth: '350px' }}>
        <h3 style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={20} /> Upcoming Reminders
        </h3>
        {reminders.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>No upcoming reminders. You're all caught up!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reminders.sort((a,b) => new Date(a.date) - new Date(b.date)).map(reminder => (
              <div key={reminder.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-text-main)' }}>{reminder.text}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {new Date(reminder.date).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(reminder.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-error-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

    </div>
  );
};

export default TeacherReminders;
