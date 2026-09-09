import { chatbotKnowledge, fallbackResponses } from '../data/chatbotKnowledge.js';

const extractMath = (text) => {
  // Normalize some words
  let normalizedText = text.toLowerCase()
    .replace(/times/g, '*')
    .replace(/multiplied by/g, '*')
    .replace(/divided by/g, '/')
    .replace(/plus/g, '+')
    .replace(/minus/g, '-')
    .replace(/x/g, '*')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');

  // Match simple arithmetic: number operator number
  const mathRegex = /(\d+)\s*([\+\-\*\/])\s*(\d+)/;
  const match = normalizedText.match(mathRegex);
  
  if (match) {
    const num1 = parseInt(match[1], 10);
    const op = match[2];
    const num2 = parseInt(match[3], 10);
    
    let result = null;
    let operatorSymbol = op;
    
    switch (op) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        operatorSymbol = '×';
        break;
      case '/':
        if (num2 === 0) return { answer: "Cannot divide by zero! 😊", isMath: true };
        // simple rounding for kids
        result = parseFloat((num1 / num2).toFixed(2));
        operatorSymbol = '÷';
        break;
      default:
        break;
    }
    
    if (result !== null) {
      return { answer: `${num1} ${operatorSymbol} ${num2} = ${result} 😊`, isMath: true };
    }
  }
  return null;
};

export const getChatbotResponse = (question, language = 'en') => {
  // 1. Check if it's a math question
  const mathResult = extractMath(question);
  if (mathResult) {
    return mathResult.answer;
  }
  
  // 2. Normalize and check knowledge base
  const normalizedQuestion = question.toLowerCase().trim().replace(/[?!.]/g, '');
  
  // Try to find a match by checking if any keyword is present in the question, or question matches keyword
  let bestMatch = null;
  let maxScore = 0;
  
  for (const topic of chatbotKnowledge) {
    for (const keyword of topic.keywords) {
      if (normalizedQuestion.includes(keyword) || keyword.includes(normalizedQuestion)) {
        // Longer keywords have higher priority (more specific)
        if (keyword.length > maxScore) {
          maxScore = keyword.length;
          bestMatch = topic;
        }
      }
    }
  }
  
  if (bestMatch) {
    // Map internal language codes (if we are using English/Hindi/Bengali strings from UI)
    let langCode = 'en';
    if (language.toLowerCase() === 'hindi') langCode = 'hi';
    if (language.toLowerCase() === 'bengali') langCode = 'bn';
    
    return bestMatch.answers[langCode] || bestMatch.answers['en'];
  }
  
  // 3. Fallback
  let langCode = 'en';
  if (language.toLowerCase() === 'hindi') langCode = 'hi';
  if (language.toLowerCase() === 'bengali') langCode = 'bn';
  
  return fallbackResponses[langCode] || fallbackResponses['en'];
};
