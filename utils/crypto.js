import crypto from 'crypto';

/**
 * Decifra il token ricevuto dall'URL per ottenere il documentId originale.
 * @param {string} encryptedText - Il token hex ricevuto nell'URL.
 * @returns {string} - Il documentId in chiaro.
 */
export const decryptId = (encryptedText) => {
  const secretKey = process.env.CIPHER_KEY; // Deve essere identica a quella di Strapi
  if (!secretKey) throw new Error("CIPHER_KEY not set in Next.js");

  try {
    // 1. Ricreiamo lo stesso IV deterministico basato sulla chiave
    const iv = crypto.createHash('sha256').update(secretKey).digest().slice(0, 16);
    
    // 2. Deriviamo la chiave di 32 byte
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    
    // 3. Prepariamo il decipher
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    
    // 4. Decifriamo
    const buffer = Buffer.from(encryptedText, 'hex');
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error("Errore durante la decriptazione:", error);
    return null; // Token manomesso o chiave errata
  }
};