import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { FileText, FileImage, FileCode, Download, ExternalLink, File as FileIcon } from 'lucide-react';
import { getFileUrl } from '../services/fileStore';
import { useToast } from '../context/ToastContext';

const MaterialCard = ({ lesson }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!lesson.fileId && !lesson.fileName) return null;

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return <FileText size={24} color="var(--color-danger)" />;
    if (type?.includes('image')) return <FileImage size={24} color="var(--color-success)" />;
    if (type?.includes('presentation') || type?.includes('powerpoint')) return <FileCode size={24} color="var(--color-warning)" />;
    if (type?.includes('word') || type?.includes('document')) return <FileText size={24} color="var(--color-primary)" />;
    return <FileIcon size={24} color="var(--color-primary)" />;
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown Size';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isPreviewable = (type) => {
    return type?.includes('pdf') || type?.includes('image');
  };

  const handleAction = async (actionType) => {
    if (!lesson.fileId) {
      addToast('File not found.', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const url = await getFileUrl(lesson.fileId, lesson.fileProvider);
      
      if (!url) {
        addToast('File could not be loaded.', 'error');
        setIsLoading(false);
        return;
      }

      if (actionType === 'open') {
        window.open(url, '_blank');
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = lesson.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error(err);
      addToast('Error accessing file.', 'error');
    }
    setIsLoading(false);
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: 'var(--fs-small)', background: 'var(--color-primary-light)', color: 'white', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
          {lesson.subject || 'Material'}
        </span>
        <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)' }}>
          {new Date(parseInt(lesson.id.split('_')[2]) || Date.now()).toLocaleDateString()}
        </span>
      </div>
      
      <h3 style={{ margin: '0 0 4px 0', color: 'var(--color-primary-dark)' }}>{lesson.title}</h3>
      {lesson.teacherName && <p style={{ margin: '0 0 12px 0', fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)' }}>By Teacher {lesson.teacherName}</p>}
      
      {lesson.content && (
         <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {lesson.content}
         </p>
      )}

      <div className="card-inner" style={{ marginTop: 'auto', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--color-bg-page)' }}>
        <div style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
           {getFileIcon(lesson.fileType)}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
           <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lesson.fileName}
           </div>
           <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {formatSize(lesson.fileSize)}
           </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {isPreviewable(lesson.fileType) && (
           <Button variant="secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={() => handleAction('open')} disabled={isLoading}>
              <ExternalLink size={16} /> View
           </Button>
        )}
        <Button variant="primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={() => handleAction('download')} disabled={isLoading}>
           <Download size={16} /> Download
        </Button>
      </div>
    </Card>
  );
};

export default MaterialCard;
