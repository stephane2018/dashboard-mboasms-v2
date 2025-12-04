/**
 * Génère une abréviation à partir d'un nom complet
 * @param fullName - Le nom complet
 * @returns L'abréviation (2 premières lettres des 2 premiers mots)
 */
export function generateAbbreviation(fullName: string): string {
  if (!fullName) return "??";
  
  const words = fullName.trim().split(/\s+/);
  
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[1][0]).toUpperCase();
}
