import React, { useState, useEffect } from 'react';
import Card from '../Card';
import { Users, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';
import Button from '../Button';

const MyClasses = ({ hideViewAll = false }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // 1. Fetch the teacher's classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, class_code, description, created_at')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (classesError) throw classesError;

      // 2. Fetch class members to calculate counts
      const classIds = classesData.map(c => c.id);
      
      let memberCounts = {};
      
      if (classIds.length > 0) {
        const { data: membersData, error: membersError } = await supabase
          .from('class_members')
          .select('id, class_id')
          .in('class_id', classIds);
          
        if (membersError) throw membersError;
        
        membersData.forEach(member => {
          memberCounts[member.class_id] = (memberCounts[member.class_id] || 0) + 1;
        });
      }
      
      const formattedData = classesData.map((cls, idx) => ({
        id: cls.id,
        name: cls.name,
        code: cls.class_code,
        description: cls.description,
        students: memberCounts[cls.id] || 0,
        color: ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)'][idx % 3]
      }));
      
      setClasses(formattedData);
    } catch (err) {
      console.error('SUPABASE CLASSES ERROR', err);
      addToast('Failed to load classes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      addToast('Please log in again to create a class.', 'error');
      return;
    }

    if (!newClassName.trim()) {
      addToast('Class name is required', 'error');
      return;
    }
    setIsCreating(true);
    try {
      const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data, error } = await supabase
        .from('classes')
        .insert([{
          name: newClassName.trim(),
          description: newClassDesc.trim(),
          class_code: classCode,
          teacher_id: user.id
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      addToast('Class created successfully!', 'success');
      setShowCreateModal(false);
      setNewClassName('');
      setNewClassDesc('');
      fetchClasses();
    } catch (err) {
      console.error('SUPABASE CREATE CLASS ERROR', err);
      addToast(err?.message || 'Failed to create class', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '200px', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="spin-animation" size={32} color="var(--color-primary)" />
        <p style={{ color: 'var(--color-text-muted)', marginTop: '10px' }}>Loading classes...</p>
      </Card>
    );
  }

  return (
    <>
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: 'var(--fs-h3)' }}>My Classes</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" onClick={() => setShowCreateModal(true)} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Create Class
            </Button>
            {!hideViewAll && (
              <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/teacher/classes')}>
                View All
              </span>
            )}
          </div>
        </div>

        {classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
            <Users size={48} opacity={0.2} style={{ marginBottom: '10px' }} />
            <p>You haven't created any classes yet.</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)} style={{ marginTop: '10px' }}>Create Your First Class</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {classes.map((cls) => (
              <div 
                key={cls.id}
                className="card-inner"
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: 'var(--color-bg-card)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                onClick={() => navigate(`/teacher/classes/${cls.id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${cls.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={20} color={cls.color} />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)' }}>{cls.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{cls.students} Students • Code: <strong>{cls.code}</strong></span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                        <ChevronRight size={20} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Create New Class</h3>
            <form onSubmit={handleCreateClass}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Class Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. English - Grade 4"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Description (Optional)</label>
                <textarea 
                  className="input-field" 
                  placeholder="Brief description of the class"
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isCreating}>
                  {isCreating ? <Loader2 size={16} className="spin-animation" /> : 'Create Class'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyClasses;
