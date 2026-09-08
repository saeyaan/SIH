export const translateText = async (text, sourceLang, targetLang) => {
  const langCodeMap = {
    'English': 'en',
    'Hindi': 'hi',
    'Bengali': 'bn'
  };

  const sl = langCodeMap[sourceLang] || 'en';
  const tl = langCodeMap[targetLang] || 'hi';

  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
    if (!response.ok) {
      throw new Error('Translation request failed');
    }
    const data = await response.json();
    let translated = '';
    data[0].forEach(item => {
      if (item[0]) {
        translated += item[0];
      }
    });
    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};
