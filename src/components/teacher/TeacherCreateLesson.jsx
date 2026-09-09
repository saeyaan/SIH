import React, { useState, useRef } from 'react';
import { Upload, Save, CheckCircle, File, X, AlertCircle } from 'lucide-react';
import Button from '../Button';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import Card from '../Card';
import { loadState, saveState } from '../../utils/storage';
import { saveFile } from '../../services/fileStore';

const TeacherCreateLesson = () => {
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    subject: '',
    language: 'English',
    content: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError('');
    
    if (!selectedFile) return;

    const allowedTypes = [
      'application/pdf', 
      'application/vnd.ms-powerpoint', 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 
      'image/png',
      'image/webp'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError('Invalid file type. Please upload a PDF, DOC, PPT, or Image.');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setFileError('File is too large. Maximum size is 10MB.');
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let storedFileId = null;
    let fileProvider = null;
    
    if (file) {
      const tempId = `file_${Date.now()}`;
      try {
        const result = await saveFile(tempId, file, file.name, file.type, file.size);
        storedFileId = result.id;
        fileProvider = result.provider;
        if (fileProvider === 'indexeddb') {
           addToast('Note: Backend storage not configured. Saved locally.', 'warning');
        }
      } catch (err) {
        console.error("Failed to save file", err);
        addToast('Failed to save file. Try again.', 'error');
        setIsSubmitting(false);
        return;
      }
    }

    setTimeout(() => {
      const newLesson = {
        id: `teacher_lesson_${Date.now()}`,
        title: formData.title,
        subject: formData.subject,
        language: formData.language,
        duration: 'New',
        isTeacherCreated: true,
        content: formData.content,
        classId: formData.classId,
        fileName: file ? file.name : null,
        fileType: file ? file.type : null,
        fileSize: file ? file.size : null,
        fileId: storedFileId,
        fileProvider: fileProvider
      };

      const existingLessons = loadState('bhashasetu_teacher_lessons', []);
      saveState('bhashasetu_teacher_lessons', [newLesson, ...existingLessons]);

      setIsSubmitting(false);
      setStep(2);
      addToast('Lesson published successfully!', 'success');
    }, 500);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      classId: '',
      subject: '',
      language: 'English',
      content: ''
    });
    setFile(null);
    setFileError('');
    setStep(1);
  };

  return (
    <Card style={{ padding: 'var(--spacing-xl)', maxWidth: '800px', margin: '0 auto' }}>
      {step === 1 ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Lesson Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g. The Solar System" required />
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Class</label>
                <select name="classId" value={formData.classId} onChange={handleChange} className="input-field" required style={{ cursor: 'pointer' }}>
                    <option value="">Select</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="input-field" required style={{ cursor: 'pointer' }}>
                    <option value="">Select</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="EVS">EVS</option>
                </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Language</label>
            <select name="language" value={formData.language} onChange={handleChange} className="input-field" required style={{ cursor: 'pointer' }}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Lesson Content</label>
            <textarea name="content" value={formData.content} onChange={handleChange} className="input-field" placeholder="Write or paste your lesson content here..." style={{ height: '150px', resize: 'vertical' }} required></textarea>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label className="form-label">{t('teachercreate.uploadFile')}</label>
            <div 
              onClick={handleFileClick}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                background: fileError ? 'rgba(255,59,48,0.05)' : 'var(--color-bg-input)', 
                border: fileError ? '1px dashed var(--color-danger)' : '1px dashed var(--color-primary)', 
                borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.ppt,.pptx,image/jpeg,image/png,image/webp" />
              
              {!file ? (
                <>
                  <div style={{ background: 'var(--color-bg-card)', padding: '12px', borderRadius: '50%', boxShadow: 'var(--shadow-neu-outer-sm)' }}>
                      <Upload size={24} color={fileError ? 'var(--color-danger)' : 'var(--color-primary)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                      <h5 style={{ margin: 0, color: fileError ? 'var(--color-danger)' : 'var(--color-text-main)' }}>
                        {fileError ? 'Upload Failed' : t('teachercreate.clickToUpload')}
                      </h5>
                      <span style={{ fontSize: '0.85rem', color: fileError ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                        {fileError || 'PDF, PPT, or Images up to 10MB'}
                      </span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'var(--color-primary-light)', padding: '12px', borderRadius: '50%', color: 'white' }}>
                        <File size={24} />
                    </div>
                    <div>
                        <h5 style={{ margin: 0, color: 'var(--color-text-main)', wordBreak: 'break-all' }}>{file.name}</h5>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} /> {formatSize(file.size)} - Ready
                        </span>
                    </div>
                  </div>
                  <button onClick={removeFile} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--color-text-muted)' }}>
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : <><Save size={18} /> {t('teachercreate.publish')}</>}
              </Button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md) auto' }}>
                <CheckCircle size={40} color="var(--color-success)" />
            </div>
            <h2 style={{ color: 'var(--color-text-main)', marginBottom: '12px' }}>{t('teachercreate.success')}</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>{t('teachercreate.successMsg')}</p>
            <Button variant="primary" onClick={resetForm} style={{ padding: '12px 32px' }}>
                {t('teachercreate.createAnother')}
            </Button>
        </div>
      )}
    </Card>
  );
};

export default TeacherCreateLesson;
