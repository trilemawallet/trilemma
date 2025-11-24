export type EncryptedPayload = {
  encrypted: string;
  iv: string;
};

const requireWebCrypto = () => {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('Web Crypto API is not available in this environment');
  }
};

const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
};

const base64ToArrayBuffer = (value: string): ArrayBuffer => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

export const generateKey = async (): Promise<CryptoKey> => {
  requireWebCrypto();
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
};

export const encryptData = async (text: string, key: CryptoKey): Promise<EncryptedPayload> => {
  requireWebCrypto();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return { encrypted: bufferToBase64(cipher), iv: bufferToBase64(iv.buffer) };
};

export const decryptData = async (encrypted: string, iv: string, key: CryptoKey): Promise<string> => {
  requireWebCrypto();
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(base64ToArrayBuffer(iv)) },
    key,
    base64ToArrayBuffer(encrypted),
  );
  return new TextDecoder().decode(decrypted);
};

export const exportKey = async (key: CryptoKey): Promise<string> => {
  requireWebCrypto();
  const jwk = await crypto.subtle.exportKey('jwk', key);
  return btoa(JSON.stringify(jwk));
};

export const importKey = async (serialized: string): Promise<CryptoKey> => {
  requireWebCrypto();
  const jwk = JSON.parse(atob(serialized));
  return crypto.subtle.importKey('jwk', jwk, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
};
