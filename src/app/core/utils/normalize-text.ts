/**
 * Normaliza texto para comparação exata, como os backends fazem na importação:
 * sem acentos, maiúsculo e com espaços únicos.
 * @param text texto original.
 */
export const normalizeText = (text: string): string =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
