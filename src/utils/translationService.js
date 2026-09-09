import { supabase } from '../lib/supabaseClient';

export const translateText = async (text, sourceLang, targetLang) => {
  const langCodeMap = {
    'English': 'en',
    'Hindi': 'hi',
    'Bengali': 'bn'
  };

  const sl = langCodeMap[sourceLang] || 'en';
  const tl = langCodeMap[targetLang] || 'hi';

  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { 
        text, 
        sourceLanguage: sl, 
        targetLanguage: tl 
      }
    });

    if (error) {
      console.error('Supabase Edge Function Error:', error);
      throw new Error(error.message || 'Translation request failed');
    }

    if (data?.notConfigured) {
      return { success: false, message: data.message };
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    if (!data?.translatedText) {
      throw new Error('No translation returned from server');
    }

    return { success: true, text: data.translatedText };
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};
