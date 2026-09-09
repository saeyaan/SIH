import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Languages, ArrowRightLeft, Copy, Loader2, Volume2, Square, Mic, MicOff } from 'lucide-react';
import { translateText } from '../utils/translationService';

const Translate = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [notConfiguredMsg, setNotConfiguredMsg] = useState('');
  const { addToast } = useToast();
  const { t } = useLanguage();
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSourceText(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        if (event.error !== 'aborted') {
          addToast(`Speech recognition error: ${event.error}`, 'error');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const isCombinationSupported = (src, tgt) => {
    if (src === tgt) return false;
    if ((src === 'Hindi' && tgt === 'Bengali') || (src === 'Bengali' && tgt === 'Hindi')) {
      return false;
    }
    return true;
  };

  const handleTranslate = async () => {
    if (!sourceText.trim() || !isValidPair) {
      addToast('Please enter text and choose a valid combination.', 'warning');
      return;
    }
    
    setIsTranslating(true);
    setNotConfiguredMsg('');
    setTranslatedText('');
    
    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      if (result.success) {
        setTranslatedText(result.text);
      } else {
        setTranslatedText('');
        setNotConfiguredMsg(result.message);
      }
    } catch (error) {
      console.error('Translation error:', error);
      addToast(error.message || 'Translation failed. Please try again.', 'error');
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
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
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
  
  const handleListen = () => {
    if (!recognitionRef.current) {
      addToast('Speech recognition is not supported in this browser. Please use a supported browser or type your text.', 'warning');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const langCodeMap = {
        'English': 'en-IN',
        'Hindi': 'hi-IN',
        'Bengali': 'bn-IN'
      };
      recognitionRef.current.lang = langCodeMap[sourceLang] || 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
      addToast('Listening...', 'info');
    }
  };

  const isValidPair = isCombinationSupported(sourceLang, targetLang);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ alignSelf: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
          <h2 style={{ color: 'var(--color-primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Languages /> Translator
          </h2>
          <p>{t('translate.subtitle')}</p>
        </div>

        <Card style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
            <select 
              value={sourceLang} 
              onChange={(e) => {
                setSourceLang(e.target.value);
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
                if (isListening && recognitionRef.current) recognitionRef.current.stop();
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

          {notConfiguredMsg && (
            <div style={{ background: 'var(--color-bg-warning)', color: '#856404', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.95rem', border: '1px solid #ffeeba' }}>
              <strong>Notice:</strong> {notConfiguredMsg}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <textarea 
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={t('translate.enterText')}
                className="input-field"
                style={{ width: '100%', height: '180px', resize: 'none' }}
              />
              <button 
                onClick={handleListen}
                title={isListening ? "Stop listening" : "Start dictation"}
                style={{ position: 'absolute', bottom: '16px', right: '16px', background: isListening ? 'var(--color-danger)' : 'var(--color-primary)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', boxShadow: 'var(--shadow-neu-outer-sm)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isListening ? 'pulse 1.5s infinite' : 'none' }}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <textarea 
                value={translatedText}
                readOnly
                placeholder={t('translate.willAppear')}
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
            {isTranslating ? <><Loader2 size={20} className="spin-animation" /> {t('translate.translating')}</> : t('translate.translateBtn')}
          </Button>
          
        </Card>
        
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 59, 48, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 59, 48, 0); }
          }
        `}</style>
      </div>
    </>
  );
};

export default Translate;
