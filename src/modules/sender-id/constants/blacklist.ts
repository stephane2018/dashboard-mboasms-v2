/**
 * Sender IDs interdits au Cameroun.
 * Vérification insensible à la casse — tous les noms sont stockés en MAJUSCULES.
 */
export const SENDER_ID_BLACKLIST = new Set([
  // ── Opérateurs Télécoms ──
  'ORANGE', 'ORANGECMR', 'MTN', 'MTNCMR', 'MTNMOMO', 'CAMTEL', 'NEXTTEL', 'YOOMEE',

  // ── Mobile Money / Finance ──
  'MOMO', 'OMMONEY', 'ORANGEMNY', 'MOBILEMNY',
  'ECOBANK', 'SGBC', 'BICEC', 'AFRILAND', 'UBA', 'CCA',
  'BEAC', 'COBAC', 'PAYPAL', 'VISA', 'MSTRCARD',

  // ── Gouvernement / Institutions ──
  'GOUVCMR', 'MINSANTE', 'MINCOM', 'MINPOSTEL', 'MINFI', 'MINDCAF',
  'MINDEF', 'MINJUSTICE', 'MINTSS', 'MINESUP', 'MINEDUB', 'MINESEC',
  'ELECAM', 'CNPS', 'CRTV', 'IMPOTS', 'DGI', 'DOUANES',
  'POLICE', 'GENDARME', 'ARMEE', 'ARCEP', 'ART',

  // ── Urgences / Sécurité ──
  'URGENCE', 'EMERGENCY', 'SOS', 'ALERTE', 'ALERT', 'DANGER', 'SECURITE',

  // ── Termes génériques / Trompeurs ──
  'INFO', 'INFOS', 'SERVICE', 'VERIFY', 'OTP', 'CODE',
  'SYSTEME', 'SYSTEM', 'ADMIN', 'TEST', 'DEFAULT', 'SMS', 'MBOASMS', 'SPAM',

  // ── Marques internationales protégées ──
  'GOOGLE', 'FACEBOOK', 'META', 'WHATSAPP', 'APPLE', 'AMAZON',
  'MICROSFT', 'NETFLIX', 'TWITTER', 'INSTAGRAM', 'TIKTOK', 'TELEGRAM',
])

export function isSenderIdBlacklisted(name: string): boolean {
  return SENDER_ID_BLACKLIST.has(name.trim().toUpperCase())
}
