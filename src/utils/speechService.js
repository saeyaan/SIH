export const getAvailableVoices = () => {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const onVoicesChanged = () => {
      voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      }
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
    }, 1500);
  });
};

// Diagnostic helper
export const logAvailableVoicesForLanguage = async (targetLangCode) => {
  const voices = await getAvailableVoices();
  const langPrefix = targetLangCode === 'eng' ? 'en' : targetLangCode === 'hin' ? 'hi' : targetLangCode === 'ben' ? 'bn' : targetLangCode;
  
  const matches = voices.filter(v => v.lang.startsWith(langPrefix));
  console.log(`Available ${langPrefix} voices:`);
  matches.forEach(v => {
    console.log(`name: ${v.name} | language: ${v.lang} | localService: ${v.localService}`);
  });
};

export const getBestVoice = async (targetLangCode) => {
  const voices = await getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  let langPrefix = '';
  let preferredLocales = [];

  switch (targetLangCode) {
    case 'en':
      langPrefix = 'en';
      preferredLocales = ['en-IN', 'en-US', 'en-GB'];
      break;
    case 'hi':
      langPrefix = 'hi';
      preferredLocales = ['hi-IN'];
      break;
    case 'bn':
      langPrefix = 'bn';
      preferredLocales = ['bn-IN', 'bn-BD'];
      break;
    default:
      langPrefix = targetLangCode;
      preferredLocales = [targetLangCode];
      break;
  }

  // 1. Try to find a voice that exactly matches a preferred locale
  for (const locale of preferredLocales) {
    const exactVoice = voices.find(v => (v.lang === locale || v.lang.replace('_', '-') === locale) && v.localService);
    if (exactVoice) return exactVoice;
  }
  for (const locale of preferredLocales) {
    const exactVoice = voices.find(v => v.lang === locale || v.lang.replace('_', '-') === locale);
    if (exactVoice) return exactVoice;
  }

  // 2. Try to find any voice starting with the base language
  const baseVoice = voices.find(v => v.lang.startsWith(langPrefix));
  if (baseVoice) return baseVoice;

  // No suitable voice found for this language
  return null;
};

export const isLanguageVoiceAvailable = async (targetLangCode) => {
  const voice = await getBestVoice(targetLangCode);
  return !!voice;
};

let utteranceQueue = [];
let isQueuePlaying = false;
let currentOnEndCallback = null;

export const stopSpeaking = () => {
  utteranceQueue = [];
  isQueuePlaying = false;
  window.speechSynthesis.cancel();
  if (currentOnEndCallback) {
    currentOnEndCallback();
    currentOnEndCallback = null;
  }
};

const playNextInQueue = () => {
  if (utteranceQueue.length === 0) {
    isQueuePlaying = false;
    if (currentOnEndCallback) {
      currentOnEndCallback();
      currentOnEndCallback = null;
    }
    return;
  }

  const { text, voice, targetLangCode } = utteranceQueue.shift();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang; // Use exact matched voice language
  
  utterance.rate = targetLangCode === 'bn' ? 0.90 : 0.95; 
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    // Only continue if we haven't been cancelled
    if (isQueuePlaying) {
      playNextInQueue();
    }
  };

  utterance.onerror = (e) => {
    if (e.error !== 'canceled') {
      console.error("Speech synthesis error", e);
    }
    if (isQueuePlaying) {
      playNextInQueue();
    }
  };

  window.speechSynthesis.speak(utterance);
};

export const speakText = async (text, targetLangCode, onEndCallback) => {
  stopSpeaking(); // Cancel any current speech

  const cleanText = text?.trim();
  if (!cleanText) {
    if (onEndCallback) onEndCallback();
    return { success: false, reason: 'empty' };
  }

  const voice = await getBestVoice(targetLangCode);
  if (!voice) {
     if (onEndCallback) onEndCallback();
     return { success: false, reason: 'no_voice' };
  }
  
  currentOnEndCallback = onEndCallback;
  
  // Split into sentences preserving the exact text and Unicode.
  // Match on standard delimiters or Bengali dari (।)
  const sentences = cleanText.match(/[^.!?।]+[.!?।]*/g) || [cleanText];
  
  utteranceQueue = sentences.map(sentence => ({
    text: sentence,
    voice,
    targetLangCode
  }));

  isQueuePlaying = true;
  playNextInQueue();
  
  return { success: true };
};
