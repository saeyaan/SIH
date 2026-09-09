import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Button from './Button';
import { Camera, Upload, Languages, Loader2, ArrowRight, Volume2, Square, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { createWorker } from 'tesseract.js';
import { supabase } from '../lib/supabaseClient';
import { speakText, stopSpeaking, isLanguageVoiceAvailable, logAvailableVoicesForLanguage } from '../utils/speechService';

// Helper to calculate UTF-8 byte length
const getUtf8ByteLength = (str) => {
  return new Blob([str]).size;
};

// Chunk text preserving paragraphs and respecting 400 bytes/chars limit
const chunkTextPreservingParagraphs = (text, maxBytes = 400) => {
  const paragraphs = text.split(/\n+/);
  const chunkedParagraphs = [];

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) {
      continue;
    }

    const paraChunks = [];
    if (getUtf8ByteLength(trimmedPara) <= maxBytes && trimmedPara.length <= 400) {
      paraChunks.push(trimmedPara);
    } else {
      const sentences = trimmedPara.match(/[^.!?]+[.!?]*\s*/g) || [trimmedPara];
      let currentChunk = '';
      for (const sentence of sentences) {
        if (getUtf8ByteLength(currentChunk + sentence) <= maxBytes && (currentChunk.length + sentence.length) <= 400) {
          currentChunk += sentence;
        } else {
          if (currentChunk) paraChunks.push(currentChunk.trim());
          if (getUtf8ByteLength(sentence) > maxBytes || sentence.length > 400) {
             const words = sentence.split(' ');
             let wordChunk = '';
             for(const word of words) {
                if (getUtf8ByteLength(wordChunk + ' ' + word) <= maxBytes && (wordChunk.length + word.length + 1) <= 400) {
                   wordChunk += (wordChunk ? ' ' : '') + word;
                } else {
                   if (wordChunk) paraChunks.push(wordChunk);
                   wordChunk = word;
                }
             }
             if (wordChunk) paraChunks.push(wordChunk);
          } else {
             currentChunk = sentence;
          }
        }
      }
      if (currentChunk) paraChunks.push(currentChunk.trim());
    }
    chunkedParagraphs.push(paraChunks);
  }
  return chunkedParagraphs;
};

const ScanTranslate = () => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  
  const [sourceLang, setSourceLang] = useState('eng'); // 'eng', 'hin', 'ben'
  const [targetLang, setTargetLang] = useState('hi'); // 'en', 'hi', 'bn'
  
  const [status, setStatus] = useState('idle'); // 'idle', 'extracting', 'extracted', 'translating', 'done'
  const [progressMsg, setProgressMsg] = useState('');
  
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(true);

  // Check voice availability on mount and when targetLang changes
  useEffect(() => {
    const checkVoice = async () => {
      const available = await isLanguageVoiceAvailable(targetLang);
      setIsVoiceAvailable(available);
      if (import.meta.env.DEV) {
        logAvailableVoicesForLanguage(targetLang);
      }
    };
    checkVoice();
  }, [targetLang]);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
        };
        img.src = url;
      } else {
        setPreviewUrl(null);
        setImageDimensions(null);
      }

      setStatus('idle');
      setProgressMsg('');
      setOriginalText('');
      setTranslatedText('');
      stopSpeaking();
      setIsSpeaking(false);
    }
  };
  
  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageDimensions(null);
    setStatus('idle');
    setProgressMsg('');
    setOriginalText('');
    setTranslatedText('');
  }

  // Helper for image preprocessing on canvas to improve OCR
  const preprocessImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Scale up if image is very small
        let width = img.width;
        let height = img.height;
        if (width < 1000) {
          const scale = 1000 / width;
          width = width * scale;
          height = height * scale;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and apply simple contrast filter
        ctx.filter = 'contrast(1.2) grayscale(100%)';
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.95);
      };
      img.onerror = () => reject(new Error('Failed to load image for preprocessing'));
      img.src = url;
    });
  };

  const handleScan = async () => {
    if (!file) {
      addToast('warning', 'Please select a file first.');
      return;
    }
    
    setStatus('extracting');
    setProgressMsg('Extracting text...');
    setOriginalText('');
    setTranslatedText('');
    stopSpeaking();
    setIsSpeaking(false);
    
    try {
      let text = '';
      
      if (file.type === 'application/pdf') {
         setProgressMsg('Extracting text from PDF...');
         const { extractPdfText } = await import('../utils/fileExtractor');
         const result = await extractPdfText(file);
         text = result.text;
         if (result.isPartial) {
            addToast('info', 'Only the first 3 pages were extracted to avoid freezing.');
         }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
         setProgressMsg('Extracting text from DOCX...');
         const { extractDocxText } = await import('../utils/fileExtractor');
         const result = await extractDocxText(file);
         text = result.text;
      } else if (file.type.startsWith('image/')) {
        setProgressMsg('Preparing image for OCR...');
        const processedBlob = await preprocessImage(file);
        
        setProgressMsg('Loading OCR engine...');
        let worker;
        
        try {
          worker = await createWorker(sourceLang, 1, {
            logger: m => {
              if (m.status === 'recognizing text' && m.progress) {
                 setProgressMsg(`Reading text... ${Math.round(m.progress * 100)}%`);
              }
            }
          });
          
          setProgressMsg('Reading text from image...');
          const result = await worker.recognize(processedBlob);
          text = result.data.text;
        } finally {
          if (worker) {
            await worker.terminate();
          }
        }
      } else {
        throw new Error('Unsupported file type for extraction.');
      }
      
      const cleanedText = text.replace(/[\n\r]+/g, '\n\n').trim(); // Ensure good paragraph breaks
      
      if (!cleanedText) {
         setStatus('idle');
         addToast('error', file.type.startsWith('image/') 
            ? 'No readable text was detected in this image.' 
            : 'No selectable text found. If this is a scanned PDF, OCR is required (not currently supported for full PDFs).');
         return;
      }
      
      setOriginalText(cleanedText);
      setStatus('extracted');
      setProgressMsg('Text extracted successfully.');
    } catch (err) {
      console.error("Extraction Error:", err);
      setStatus('idle');
      addToast('error', 'Failed to extract text. Please try again.');
    }
  };

  const handleTranslate = async () => {
    if (!originalText) {
      addToast('warning', 'No text to translate.');
      return;
    }
    
    const sourceLangCode = sourceLang === 'eng' ? 'en' : sourceLang === 'hin' ? 'hi' : 'bn';
    if (sourceLangCode === targetLang) {
       addToast('info', 'Source and target languages are the same.');
       setTranslatedText(originalText);
       setStatus('done');
       return;
    }

    setStatus('translating');
    setProgressMsg('Preparing text chunks...');
    
    try {
      const chunkedParagraphs = chunkTextPreservingParagraphs(originalText);
      const translatedParagraphs = [];
      
      let totalChunks = 0;
      chunkedParagraphs.forEach(p => totalChunks += p.length);
      
      let currentChunkIndex = 0;

      for (const paraChunks of chunkedParagraphs) {
        if (paraChunks.length === 0) continue;
        
        const translatedParaChunks = [];
        
        for (const chunk of paraChunks) {
          if (!chunk.trim()) continue;
          
          currentChunkIndex++;
          setProgressMsg(`Translating page... ${currentChunkIndex} / ${totalChunks}`);
          
          let translatedChunk = '';
          let attempts = 0;
          let success = false;
          
          while (attempts < 2 && !success) {
            try {
              const { data, error } = await supabase.functions.invoke('translate', {
                body: {
                  text: chunk,
                  sourceLanguage: sourceLangCode,
                  targetLanguage: targetLang
                }
              });
              
              if (error) throw error;
              if (data && data.translatedText) {
                 translatedChunk = data.translatedText;
                 success = true;
              } else {
                 throw new Error('No translated text received');
              }
            } catch (chunkErr) {
               console.error("Chunk translation error:", chunkErr);
               attempts++;
               if (attempts >= 2) {
                 throw chunkErr; // Escalate after retries
               }
               // Wait briefly before retry
               await new Promise(r => setTimeout(r, 1000));
            }
          }
          translatedParaChunks.push(translatedChunk);
        }
        
        translatedParagraphs.push(translatedParaChunks.join(' '));
      }
      
      const finalTranslatedText = translatedParagraphs.join('\n\n');
      setTranslatedText(finalTranslatedText);
      setStatus('done');
      setProgressMsg('Translation complete.');
      addToast('success', 'Translation complete!');
      
    } catch (err) {
      console.error("Translation Error:", err);
      setStatus('extracted');
      addToast('error', 'Sorry, we couldn\'t translate this page right now. Please try again.');
      setProgressMsg('Translation failed.');
    }
  };

  const handleSpeak = async () => {
    if (!translatedText) {
      addToast('info', 'Nothing to listen to yet.');
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    try {
      const result = await speakText(translatedText, targetLang, () => {
        setIsSpeaking(false);
      });
      
      if (!result.success) {
        setIsSpeaking(false);
        if (result.reason === 'no_voice') {
          addToast('info', 'A voice for this language is not available in your browser.');
        } else {
          addToast('info', 'Nothing to listen to yet.');
        }
      }
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
      addToast('error', 'Speech synthesis failed.');
    }
  };

  return (
    <Card style={{ margin: 'var(--spacing-xl) 0', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--spacing-md)' }}>
        <div style={{ background: 'var(--color-primary)', padding: '8px', borderRadius: '50%', color: 'white', display: 'flex' }}>
          <Camera size={20} />
        </div>
        <h3 style={{ margin: 0, color: 'var(--color-primary-dark)' }}>{t('scan.title') || 'Scan & Translate'}</h3>
      </div>
      
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
        Upload a picture of a textbook page to extract the text and translate the full page.
      </p>

      {/* Main Grid: 2 columns on desktop, 1 on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-xl)', alignItems: 'start' }}>
        
        {/* Left Column: Upload & OCR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          
          <div style={{ marginBottom: '8px', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Step 1: Upload textbook page
          </div>
          
          <label 
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: previewUrl ? 'auto' : '180px', minHeight: '180px', border: '2px dashed var(--color-primary)', borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg-input)', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
            }}
          >
            {previewUrl ? (
              <div style={{ width: '100%', position: 'relative' }}>
                <img src={previewUrl} alt="Preview" style={{ width: '100%', display: 'block', maxHeight: '400px', objectFit: 'contain', background: '#f8f9fa' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '60%' }}>{file.name}</span>
                  {imageDimensions && <span>{imageDimensions.width}x{imageDimensions.height}</span>}
                </div>
                <button 
                  onClick={removeImage}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                >
                  Remove / Change
                </button>
              </div>
            ) : file ? (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-primary)' }}>
                <div style={{ fontWeight: 600, wordBreak: 'break-all' }}>{file.name}</div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>File selected</div>
                <button 
                  onClick={removeImage}
                  style={{ marginTop: '12px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                >
                  Remove / Change
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-text-muted)' }}>
                <Upload size={32} color="var(--color-primary)" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 600 }}>{t('scan.uploadImage') || 'Upload File'}</div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Supports JPG, PNG, WEBP, PDF, DOCX</div>
              </div>
            )}
            <input type="file" accept="image/jpeg, image/png, image/webp, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: (previewUrl || file) ? 'default' : 'pointer', display: (previewUrl || file) ? 'none' : 'block' }} disabled={status === 'extracting' || status === 'translating'} />
          </label>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Source Language:</span>
            <select 
              className="input-field"
              value={sourceLang}
              onChange={(e) => {
                setSourceLang(e.target.value);
                setOriginalText('');
                setStatus(file ? 'idle' : 'idle');
              }}
              style={{ flex: 1, padding: '10px 14px', cursor: 'pointer' }}
              disabled={status === 'extracting' || status === 'translating'}
            >
              <option value="eng">English</option>
              <option value="hin">Hindi</option>
              <option value="ben">Bengali</option>
            </select>
          </div>

          <Button 
            variant="primary" 
            onClick={handleScan} 
            disabled={!file || status === 'extracting' || status === 'translating'}
            style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', marginTop: '8px' }}
          >
            {status === 'extracting' ? <Loader2 size={18} className="spin" /> : <Camera size={18} />}
            Step 2: Scan & Extract Text
          </Button>
          
          {(status === 'extracting' || status === 'translating') && progressMsg && (
             <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textAlign: 'center', fontWeight: 500 }}>
                {progressMsg}
             </div>
          )}
        </div>

        {/* Right Column: Original Text & Translation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          
          <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
            Step 3: Review / Edit Extracted Text
          </div>
          
          <div className="card-inner" style={{ padding: '0', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'var(--color-bg-card)', padding: '8px 12px', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)' }}>
              <span>{t('scan.originalText') || 'Original Text'}</span>
              {(status === 'extracted' || status === 'done' || originalText.length > 0) && <span style={{ color: 'var(--color-primary)' }}>Edit text if needed</span>}
            </div>
            <textarea 
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder={status === 'extracting' ? 'Scanning...' : 'Upload and scan a page to extract text.'}
              disabled={status === 'extracting' || status === 'translating'}
              style={{ 
                width: '100%', minHeight: '150px', border: 'none', resize: 'vertical', padding: '12px',
                fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--color-text-main)', background: 'transparent',
                outline: 'none', borderBottomLeftRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Step 4: Target Language:</span>
            <select 
              className="input-field"
              value={targetLang}
              onChange={(e) => {
                setTargetLang(e.target.value);
                stopSpeaking();
                setIsSpeaking(false);
              }}
              style={{ flex: 1, padding: '10px 14px', cursor: 'pointer' }}
              disabled={status === 'extracting' || status === 'translating'}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
            </select>
          </div>

          <Button 
            variant="secondary" 
            onClick={handleTranslate} 
            disabled={!originalText || status === 'extracting' || status === 'translating'}
            style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', marginTop: '8px', background: 'var(--color-primary-light)', color: 'white' }}
          >
            {status === 'translating' ? <Loader2 size={18} className="spin" /> : <Languages size={18} />}
            Step 5: Translate Full Page
          </Button>

          {translatedText && (
            <div style={{ marginTop: 'var(--spacing-md)', animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                Step 6: Read / Listen to Translation
              </div>
              <div className="card-inner" style={{ padding: '0', position: 'relative', background: '#f8f9fa', border: '1px solid #dee2e6' }}>
                <div style={{ background: '#e9ecef', padding: '8px 12px', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#495057' }}>
                      {t('scan.translatedText') || 'Translated Text'}
                    </span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '12px', background: isVoiceAvailable ? '#d1e7dd' : '#f8d7da', color: isVoiceAvailable ? '#0f5132' : '#842029', border: `1px solid ${isVoiceAvailable ? '#badbcc' : '#f5c2c7'}` }}>
                      {isVoiceAvailable ? `Voice: ${targetLang === 'en' ? 'English' : targetLang === 'hi' ? 'Hindi' : 'Bengali'}` : 'Voice unavailable'}
                    </span>
                  </div>
                  <button 
                    onClick={handleSpeak}
                    disabled={!isVoiceAvailable}
                    title={!isVoiceAvailable ? 'Voice not available' : isSpeaking ? 'Stop' : 'Listen to translation'}
                    aria-label={!isVoiceAvailable ? 'Voice not available' : isSpeaking ? `Stop ${targetLang === 'en' ? 'English' : targetLang === 'hi' ? 'Hindi' : 'Bengali'} speech` : `Listen to ${targetLang === 'en' ? 'English' : targetLang === 'hi' ? 'Hindi' : 'Bengali'} translation`}
                    style={{ background: isVoiceAvailable ? 'var(--color-primary)' : '#6c757d', border: 'none', borderRadius: '4px', padding: '4px 12px', cursor: isVoiceAvailable ? 'pointer' : 'not-allowed', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, transition: 'background 0.2s', opacity: isVoiceAvailable ? 1 : 0.6 }}
                  >
                    {isSpeaking ? <Square size={16} fill="white" /> : <Volume2 size={16} />}
                    {isSpeaking ? 'Stop' : 'Listen'}
                  </button>
                </div>
                <div style={{ padding: '16px', fontSize: '1.1rem', lineHeight: 1.6, color: '#212529', fontWeight: 400, whiteSpace: 'pre-wrap', minHeight: '100px' }}>
                  {!isVoiceAvailable && targetLang === 'bn' && (
                    <div style={{ fontSize: '0.85rem', color: '#842029', background: '#f8d7da', padding: '8px 12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #f5c2c7' }}>
                      Bengali voice is not available in this browser/device.
                    </div>
                  )}
                  {translatedText}
                </div>
              </div>
            </div>
          )}
          
        </div>
        
      </div>
    </Card>
  );
};

export default ScanTranslate;
