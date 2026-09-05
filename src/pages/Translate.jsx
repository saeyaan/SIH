import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { Languages, ArrowRightLeft, Copy, Loader2 } from 'lucide-react';

const Translate = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [isTranslating, setIsTranslating] = useState(false);
  const { addToast } = useToast();

  const handleTranslate = () => {
    if (!sourceText.trim()) {
      addToast('Please enter text to translate.', 'warning');
      return;
    }
    
    setIsTranslating(true);
    
    // Simulate API call
    setTimeout(() => {
      setTranslatedText(`[Mock ${targetLang} Translation]: ${sourceText}`);
      setIsTranslating(false);
    }, 1500);
  };

  const handleSwap = () => {
    // LT-018: Prevent same-language situation: only swap if languages are different
    if (sourceLang === targetLang) return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    // Clear translated text on swap to avoid mock-prefixed string becoming source
    setSourceText('');
    setTranslatedText('');
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    // LT-017: Handle clipboard API failure gracefully
    try {
      await navigator.clipboard.writeText(translatedText);
      addToast('Copied to clipboard!', 'success');
    } catch {
      addToast('Could not copy. Please copy manually.', 'error');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ alignSelf: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
          <h2 style={{ color: 'var(--color-primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Languages /> Translator
          </h2>
          <p>Understand anything in your preferred language.</p>
        </div>

        <Card style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
            <select 
              value={sourceLang} 
              onChange={(e) => setSourceLang(e.target.value)}
              className="input-field"
              style={{ flex: 1, cursor: 'pointer', fontWeight: 600 }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Bengali">Bengali</option>
            </select>
            
            <button 
              onClick={handleSwap}
              style={{ background: 'var(--color-bg-card)', color: 'var(--color-primary)', border: '1px solid rgba(255,255,255,0.8)', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-neu-outer-sm)', transition: 'all 0.2s' }}
            >
              <ArrowRightLeft size={20} />
            </button>

            <select 
              value={targetLang} 
              onChange={(e) => setTargetLang(e.target.value)}
              className="input-field"
              style={{ flex: 1, cursor: 'pointer', fontWeight: 600 }}
            >
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <textarea 
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="input-field"
                style={{ width: '100%', height: '180px', resize: 'none' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <textarea 
                value={translatedText}
                readOnly
                placeholder="Translation will appear here..."
                className="input-field"
                style={{ width: '100%', height: '180px', resize: 'none', color: 'var(--color-primary-dark)', fontWeight: 600, background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-neu-outer-sm)' }}
              />
              {translatedText && (
                <button 
                  onClick={handleCopy}
                  style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'var(--color-bg-card)', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-neu-outer-sm)', color: 'var(--color-primary)' }}
                >
                  <Copy size={20} />
                </button>
              )}
            </div>
          </div>

          <Button variant="primary" onClick={handleTranslate} disabled={isTranslating} style={{ display: 'flex', justifyContent: 'center' }}>
            {isTranslating ? <><Loader2 size={20} className="spin-animation" /> Translating...</> : 'Translate'}
          </Button>
          
        </Card>
      </div>
    </>
  );
};

export default Translate;
