// Sinhala-specific utilities

// Validate Sinhala text
export function isValidSinhala(text: string): boolean {
  // Sinhala Unicode range: U+0D80 to U+0DFF
  const sinhalaRegex = /[\u0D80-\u0DFF]/;
  return sinhalaRegex.test(text);
}

// Get Sinhala character count
export function getSinhalaCharCount(text: string): number {
  return (text.match(/[\u0D80-\u0DFF]/g) || []).length;
}

// Check if text contains Sinhala
export function containsSinhala(text: string): boolean {
  return isValidSinhala(text);
}

// Clean Sinhala text (remove non-Sinhala characters if needed)
export function cleanSinhalaText(text: string, keepEnglish: boolean = true): string {
  if (keepEnglish) {
    // Keep Sinhala, English, numbers, and common punctuation
    return text.replace(/[^\u0D80-\u0DFFa-zA-Z0-9\s.,!?;:'"()-]/g, '');
  } else {
    // Keep only Sinhala characters and spaces
    return text.replace(/[^\u0D80-\u0DFF\s]/g, '');
  }
}

// Detect language of text
export function detectLanguage(text: string): 'sinhala' | 'english' | 'mixed' {
  const sinhalaCount = getSinhalaCharCount(text);
  const englishCount = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;

  if (sinhalaCount === 0) return 'english';
  if (englishCount === 0) return 'sinhala';
  if (sinhalaCount / totalChars > 0.5) return 'sinhala';
  if (englishCount / totalChars > 0.5) return 'english';
  return 'mixed';
}

// Format Sinhala numbers (already in textFormatter, but adding validation)
export function validateSinhalaNumber(num: number): boolean {
  return num >= 0 && num <= 999999; // Reasonable range for Sinhala number conversion
}

