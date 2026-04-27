import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = crypto.createHash('sha256').update(String(process.env.ENCRYPTION_KEY)).digest(); 
const IV_LENGTH = 12;

export function encrypt(text: string): string {
  if (!text) return text;
  
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error("Erreur d'encryptage:", error);
    return text;
  }
}

export function decrypt(encryptedText: string): string {
  // Vérification de sécurité pour les anciens formats ou données vides
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

  try {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    // Si le décryptage échoue (ex: mauvaise clé), on retourne le texte original 
    // ou une indication d'erreur pour éviter de faire planter l'UI
    console.error("Erreur de décryptage:", error);
    return "[Donnée corrompue]";
  }
}