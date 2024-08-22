import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() { }

encrypt(data: string): string {
  const key = CryptoJS.enc.Hex.parse('5b05196eb7aa7f487ad6de85828e1b09');
  const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
  const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });

  // Convert to Base64 URL-safe
  return encrypted.toString()
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

decrypt(encryptedData: string): string {
  // Convert from Base64 URL-safe
  let normalizedEncryptedData = encryptedData
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  // Add padding if necessary
  const mod4 = normalizedEncryptedData.length % 4;
  if (mod4 > 0) {
      normalizedEncryptedData += new Array(5 - mod4).join('=');
  }

  const key = CryptoJS.enc.Hex.parse('5b05196eb7aa7f487ad6de85828e1b09');
  const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
  const decrypted = CryptoJS.AES.decrypt(normalizedEncryptedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

}
