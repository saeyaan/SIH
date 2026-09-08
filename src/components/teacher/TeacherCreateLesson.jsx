import React, { useState } from 'react';
import { Upload, Save, CheckCircle } from 'lucide-react';
import Button from '../Button';
import { useToast } from '../../context/ToastContext';
import Card from '../Card';

const TeacherCreateLesson = () => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      addToast('Lesson published successfully!', 'success');
    }, 1500);
  };

  return (
    <Card style={{ padding: 'var(--spacing-xl)', maxWidth: '800px', margin: '0 auto' }}>
      {step === 1 ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Lesson Title</label>
            <input type="text" className="input-field" placeholder="e.g. The Solar System" required />
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Class</label>
                <select className="input-field" required style={{ cursor: 'pointer' }}>
                    <option value="">Select</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Subject</label>
                <select className="input-field" required style={{ cursor: 'pointer' }}>
                    <option value="">Select</option>
                    <option value="Science">Science</option>
                    <option value="Maths">Mathematics</option>
                    <option value="EVS">EVS</option>
                </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Language</label>
            <select className="input-field" required style={{ cursor: 'pointer' }}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Lesson Content</label>
            <textarea className="input-field" placeholder="Write or paste your lesson content here..." style={{ height: '150px', resize: 'vertical' }} required></textarea>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--color-bg-input)', border: '1px dashed var(--color-primary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ background: 'var(--color-bg-card)', padding: '12px', borderRadius: '50%', boxShadow: 'var(--shadow-neu-outer-sm)' }}>
                  <Upload size={24} color="var(--color-primary)" />
              </div>
              <div>
                  <h5 style={{ margin: 0, color: 'var(--color-text-main)' }}>Upload File (Optional)</h5>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>PDF, PPT, or Images up to 10MB</span>
              </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : <><Save size={18} /> Publish Lesson</>}
              </Button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md) auto' }}>
                <CheckCircle size={40} color="var(--color-success)" />
            </div>
            <h2 style={{ color: 'var(--color-text-main)', marginBottom: '12px' }}>Success!</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>Your lesson is now available to students, automatically translated to their preferred languages.</p>
            <Button variant="primary" onClick={() => setStep(1)} style={{ padding: '12px 32px' }}>
                Create Another Lesson
            </Button>
        </div>
      )}
    </Card>
  );
};

export default TeacherCreateLesson;
