import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../Card';
import Button from '../Button';
import { Users, ArrowLeft, BookOpen, Clock, Activity, File, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  const fetchClassDetails = async () => {
    setLoading(true);
    try {
      // Fetch class info
      const { data: clsData, error: clsError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (clsError) throw clsError;
      
      setClassInfo({
        ...clsData,
        color: 'var(--color-primary)'
      });

      // Fetch students
      const { data: membersData, error: memError } = await supabase
        .from('class_members')
        .select(`
          joined_at,
          profiles (
            id,
            name,
            student_code
          )
        `)
        .eq('class_id', id)
        .order('joined_at', { ascending: false });

      if (memError) throw memError;

      const formattedStudents = membersData
        .filter(m => m.profiles) // ensure profile exists
        .map(m => ({
          id: m.profiles.id,
          name: m.profiles.name,
          studentCode: m.profiles.student_code || 'N/A',
          joinedAt: new Date(m.joined_at).toLocaleDateString()
        }));

      setStudents(formattedStudents);
    } catch (err) {
      console.error(err);
      addToast('Failed to load class details.', 'error');
      navigate('/teacher/classes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="spin-animation" size={40} color="var(--color-primary)" />
        <p style={{ color: 'var(--color-text-muted)', marginTop: '16px' }}>Loading class details...</p>
      </div>
    );
  }

  if (!classInfo) return null;

  return (
    <div style={{ padding: 'var(--spacing-md)', animation: 'fadeIn 0.4s ease', maxWidth: '1000px', margin: '0 auto' }}>
      <Button variant="outline" onClick={() => navigate('/teacher/classes')} style={{ marginBottom: '1rem', padding: '8px 16px', display: 'flex', gap: '8px' }}>
        <ArrowLeft size={16} /> Back to Classes
      </Button>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: `${classInfo.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users size={40} color={classInfo.color} />
        </div>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: 'var(--color-primary-dark)', fontSize: '2rem' }}>{classInfo.name}</h2>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16}/> {students.length} Students</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-bg-input)', padding: '4px 10px', borderRadius: '8px', color: 'var(--color-text-main)' }}>Code: <strong style={{ letterSpacing: '1px' }}>{classInfo.class_code}</strong></span>
          </div>
          {classInfo.description && (
             <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{classInfo.description}</p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', overflowX: 'auto', paddingBottom: '4px' }}>
        {['Overview', 'Students', 'Lessons', 'Assignments', 'Materials', 'Activity'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{ 
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.toLowerCase() ? `3px solid var(--color-primary)` : '3px solid transparent',
              color: activeTab === tab.toLowerCase() ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color="var(--color-primary)" /> Recent Activity</h3>
            {students.length > 0 ? (
               <ul style={{ paddingLeft: '20px', color: 'var(--color-text-main)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <li>Class created on {new Date(classInfo.created_at).toLocaleDateString()}</li>
                 <li>{students.length} students have joined this class</li>
               </ul>
            ) : (
               <p style={{ color: 'var(--color-text-muted)' }}>No activity yet. Share the class code <strong>{classInfo.class_code}</strong> with your students.</p>
            )}
          </Card>
          <Card>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={20} color="var(--color-secondary)" /> Upcoming</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>No upcoming events.</p>
          </Card>
        </div>
      )}

      {activeTab === 'students' && (
        <Card style={{ padding: 0, overflow: 'hidden', overflowX: 'auto' }}>
          {students.length === 0 ? (
             <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Users size={40} opacity={0.2} style={{ marginBottom: '10px' }} />
                <p>No students have joined yet.</p>
                <p style={{ fontSize: '0.9rem' }}>Share the class code <strong>{classInfo.class_code}</strong> for them to join.</p>
             </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead style={{ background: 'var(--color-bg-input)' }}>
                <tr>
                  <th style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>Name</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>Student Code</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>Joined On</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => (
                  <tr key={student.id} style={{ background: i % 2 === 0 ? 'white' : 'var(--color-bg-main)' }}>
                    <td style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>{student.name}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>{student.studentCode}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>{student.joinedAt}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ padding: '4px 10px', background: 'var(--color-pastel-mint)', color: 'var(--color-primary-dark)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {(activeTab === 'materials' || activeTab === 'lessons' || activeTab === 'assignments') && (
        <Card>
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <File size={40} opacity={0.2} style={{ marginBottom: '10px' }} />
            <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} functionality coming soon.</p>
          </div>
        </Card>
      )}

    </div>
  );
};

export default ClassDetails;
