import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { Languages, ArrowRightLeft, Copy, Loader2, Volume2, Square } from 'lucide-react';
import { translateText } from '../utils/translationService';

const Translate = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { addToast } = useToast();

  const isCombinationSupported = (src, tgt) => {
    if (src === tgt) return false;
    if ((src === 'Hindi' && tgt === 'Bengali') || (src === 'Bengali' && tgt === 'Hindi')) {
      return false;
    }
    return true;
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      addToast('Please enter text to translate.', 'warning');
      return;
    }

    if (!isCombinationSupported(sourceLang, targetLang)) {
      addToast('This language combination is not supported.', 'error');
      return;
    }
    
    setIsTranslating(true);
    setTranslatedText('');
    
    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (error) {
      addToast('Translation failed. Please try again.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = () => {
    if (sourceLang === targetLang) return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText('');
    setTranslatedText('');
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      addToast('Copied!', 'success');
    } catch {
      addToast('Could not copy. Please copy manually.', 'error');
    }
  };

  const handleSpeak = () => {
    if (!translatedText) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    
    const langCodeMap = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Bengali': 'bn-IN'
    };
    
    utterance.lang = langCodeMap[targetLang] || 'en-US';
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      addToast('Speech synthesis failed.', 'error');
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const isValidPair = isCombinationSupported(sourceLang, targetLang);

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
              onChange={(e) => {
                setSourceLang(e.target.value);
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }}
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
              onChange={(e) => {
                setTargetLang(e.target.value);
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }}
              className="input-field"
              style={{ flex: 1, cursor: 'pointer', fontWeight: 600 }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>

          {!isValidPair && (
            <div style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>
              Translation between {sourceLang} and {targetLang} is not supported.
            </div>
          )}

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
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handleSpeak}
                    title="Listen to translation"
                    style={{ background: 'var(--color-bg-card)', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-neu-outer-sm)', color: 'var(--color-primary)' }}
                  >
                    {isSpeaking ? <Square size={20} /> : <Volume2 size={20} />}
                  </button>
                  <button 
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    style={{ background: 'var(--color-bg-card)', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-neu-outer-sm)', color: 'var(--color-primary)' }}
                  >
                    <Copy size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Button variant="primary" onClick={handleTranslate} disabled={isTranslating || !isValidPair || !sourceText.trim()} style={{ display: 'flex', justifyContent: 'center' }}>
            {isTranslating ? <><Loader2 size={20} className="spin-animation" /> Translating...</> : 'Translate'}
          </Button>
          
        </Card>
      </div>
    </>
  );
};

export default Translate;
