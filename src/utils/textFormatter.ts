// Text formatting utilities

export const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/\n\s*\n/g, '\n\n') // Multiple newlines to double
    .trim();
};

export const capitalizeSentences = (text: string): string => {
  return text
    .split(/([.!?]\s+)/)
    .map((sentence, index) => {
      if (index === 0 || sentence.match(/^[.!?]\s+$/)) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
      }
      return sentence;
    })
    .join('');
};

// Number to words converter (English)
const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const convertHundreds = (num: number): string => {
  if (num === 0) return '';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return tens[ten] + (one > 0 ? '-' + ones[one] : '');
  }
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  return ones[hundred] + ' hundred' + (remainder > 0 ? ' ' + convertHundreds(remainder) : '');
};

export const numberToWords = (num: number): string => {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + numberToWords(-num);
  
  if (num < 1000) return convertHundreds(num);
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;
    return convertHundreds(thousand) + ' thousand' + (remainder > 0 ? ' ' + convertHundreds(remainder) : '');
  }
  if (num < 1000000000) {
    const million = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    return convertHundreds(million) + ' million' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }
  return num.toString(); // Too large, return as number
};

// Sinhala number converter
const sinhalaNumbers = ['ශුන්ය', 'එක', 'දෙක', 'තුන', 'හතර', 'පහ', 'හය', 'හත', 'අට', 'නවය'];
const sinhalaTens = ['', '', 'විස්ස', 'තිහ', 'හතළිහ', 'පනහ', 'හැට', 'හැත්තෑව', 'අසූව', 'අනූව'];

export const numberToSinhala = (num: number): string => {
  if (num === 0) return sinhalaNumbers[0];
  if (num < 10) return sinhalaNumbers[num];
  if (num < 20) {
    if (num === 10) return 'දහය';
    if (num === 11) return 'එකොළහ';
    if (num === 12) return 'දොළහ';
    if (num === 13) return 'දහතුන';
    if (num === 14) return 'දහහතර';
    if (num === 15) return 'පහළොව';
    if (num === 16) return 'දහසය';
    if (num === 17) return 'දහහත';
    if (num === 18) return 'දහඅට';
    if (num === 19) return 'දහනවය';
  }
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return sinhalaTens[ten] + (one > 0 ? ' ' + sinhalaNumbers[one] : '');
  }
  return num.toString(); // For larger numbers, return as number
};

export const replaceNumbersInText = (text: string, toSinhala: boolean = false): string => {
  const numberRegex = /\b\d+\b/g;
  return text.replace(numberRegex, (match) => {
    const num = parseInt(match, 10);
    return toSinhala ? numberToSinhala(num) : numberToWords(num);
  });
};

export const removeExtraSpaces = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
};

export const removeLineBreaks = (text: string): string => {
  return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
};

export const addLineBreaks = (text: string, maxLength: number = 80): string => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);

  return lines.join('\n');
};

export const getTextStats = (text: string) => {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Word frequency
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    const clean = word.toLowerCase().replace(/[.,!?;:]/g, '');
    wordFreq[clean] = (wordFreq[clean] || 0) + 1;
  });

  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: words.length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    averageWordsPerSentence: words.length / sentences.length || 0,
    topWords,
    readingTime: Math.ceil(words.length / 200) // Average reading speed: 200 words/min
  };
};

