import DOMPurify from 'dompurify';

export const sanitizeTranslation = (text) => {
  if (!text) return '';
  const cleaned = text.replace(/<sup[^>]*>.*?<\/sup>/g, '');
  return DOMPurify.sanitize(cleaned, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};