import React, { useState, useEffect } from 'react';
import Card from '../Card';
import { Users, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import Button from '../Button';

const MyClassesStudent = () => {
  const { user } = useApp();
  const { addToast } = useToast();
  
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    fetchJoinedClasses();
  }, [user]);

  const fetchJoinedClasses = async () => {
    if (!user || !supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_members')
        .select(`
          class_id,
          classes (
            id,
            name,
            class_code,
            description,
            profiles (name)
          )
        `)
        .eq('student_id', user.id)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data.filter(item => item.classes).map((item, idx) => ({
        id: item.classes.id,
        name: item.classes.name,
        code: item.classes.class_code,
        description: item.classes.description,
        teacherName: item.classes.profiles?.name || 'Unknown Teacher',
        color: ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)'][idx % 3]
      }));
      
      setClasses(formattedData);
    } catch (err) {
      console.error(err);
      addToast('Failed to load your classes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      addToast('Class code is required', 'error');
      return;
    }
    
    setIsJoining(true);
    try {
      // We use the helper RPC function to securely resolve and join the class
      const { data, error } = await supabase.rpc('join_class_by_code', {
        p_class_code: joinCode.trim().toUpperCase()
      });
      
      if (error) {
        if (error.message.includes('Invalid class code')) {
           throw new Error('Invalid class code. Please check and try again.');
        } else if (error.message.includes('Already joined')) {
           throw new Error('You have already joined this class.');
        } else {
           throw error;
        }
      }
      
      addToast(`Successfully joined ${data.class_name}!`, 'success');
      setShowJoinModal(false);
      setJoinCode('');
      fetchJoinedClasses();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to join class', 'error');
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '150px', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <Loader2 className="spin-animation" size={24} color="var(--color-primary)" />
      </Card>
    );
  }

  return (
    <>
      <Card style={{ display: 'flex', flexDirection: 'column', marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h3 style={{ margin: 0, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ color: 'var(--color-primary)' }}>🏫</span> My Classes
          </h3>
          <Button variant="outline" onClick={() => setShowJoinModal(true)} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Join Class
          </Button>
        </div>

        {classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>
            <p>You haven't joined any classes yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            {classes.map((cls) => (
              <div 
                key={cls.id}
                className="card-inner"
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--color-bg-card)',
                    borderRadius: '12px'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${cls.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={20} color={cls.color} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cls.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>By {cls.teacherName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Join Class Modal */}
      {showJoinModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Join a Class</h3>
            <form onSubmit={handleJoinClass}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Class Code</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. A1B2C3"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  autoFocus
                  style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>Ask your teacher for the 6-character class code.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button variant="outline" type="button" onClick={() => setShowJoinModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isJoining}>
                  {isJoining ? <Loader2 size={16} className="spin-animation" /> : 'Join Class'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyClassesStudent;
