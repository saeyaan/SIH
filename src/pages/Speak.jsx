import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { Mic, Square, Play, Volume2 } from 'lucide-react';

const Speak = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const { addToast } = useToast();

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsAnalyzing(true);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setResult({
          text: "पानी",
          feedback: "Great job! You said the word correctly.",
          success: true
        });
        setAttempts(prev => prev + 1);
        addToast('Pronunciation analyzed successfully!', 'success');
      }, 1500);
    } else {
      setIsRecording(true);
      setResult(null);
    }
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    } else {
      addToast('Audio playback is not available on this device.', 'error');
    }
  };

  const handlePracticeAgain = () => {
    setResult(null);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ alignSelf: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
          <h2 style={{ color: 'var(--color-primary-dark)' }}>Practice Speaking</h2>
          <p>Speak with confidence and improve your pronunciation.</p>
        </div>
        
        <Card style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div className="card-inner" style={{ padding: 'var(--spacing-lg) var(--spacing-xl)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: 'var(--spacing-xl)' }}>
            <h3 style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body)' }}>Today's Word</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1.5rem 0' }}>
              <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'var(--color-primary-dark)', margin: 0, lineHeight: 1 }}>पानी</h1>
              <button 
                onClick={() => playAudio('पानी')}
                style={{ background: 'white', border: 'none', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-primary)', boxShadow: 'var(--shadow-neu-outer-sm)', transition: 'transform 0.2s' }}
              >
                <Volume2 size={24} />
              </button>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-h3)', fontWeight: 600 }}>Water (Pani)</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {result ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-md)', width: '100%', animation: 'modalIn 0.3s ease' }}>
                <div style={{ padding: 'var(--spacing-md)', background: result.success ? 'var(--color-success-light)' : 'var(--color-danger-light)', borderRadius: 'var(--radius-md)', color: result.success ? 'var(--color-success)' : 'var(--color-danger)', width: '100%', border: `1px solid ${result.success ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--fs-h4)' }}>You said: "{result.text}"</h4>
                  <p style={{ margin: 0, color: 'inherit' }}>{result.feedback}</p>
                </div>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Attempts: {attempts}</p>
                <Button variant="primary" onClick={handlePracticeAgain} style={{ marginTop: 'var(--spacing-sm)', width: '200px' }}>
                  Practice Again
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
                <div 
                  onClick={!isAnalyzing ? handleToggleRecord : undefined}
                  style={{ 
                    width: '120px', height: '120px', 
                    borderRadius: '50%', 
                    background: isRecording ? 'var(--color-danger)' : 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    cursor: isAnalyzing ? 'default' : 'pointer',
                    color: 'white',
                    boxShadow: isRecording ? '0 0 0 15px rgba(255, 59, 48, 0.2)' : '0 10px 30px rgba(88, 86, 214, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  className={isRecording ? 'pulse-animation' : ''}
                >
                  {isAnalyzing ? (
                    <div className="spin-animation" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div>
                  ) : isRecording ? (
                    <Square size={48} fill="white" />
                  ) : (
                    <Mic size={48} />
                  )}
                </div>
                
                <h3 style={{ margin: 0, color: 'var(--color-text-main)', opacity: isAnalyzing ? 0.5 : 1, fontSize: 'var(--fs-h4)' }}>
                  {isAnalyzing ? 'Analyzing pronunciation...' : isRecording ? 'Recording... Tap to stop' : 'Tap the microphone to start'}
                </h3>
              </div>
            )}
          </div>
        </Card>
      </div>

      <style>{`
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(255, 59, 48, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0); }
        }
      `}</style>
    </>
  );
};

export default Speak;
