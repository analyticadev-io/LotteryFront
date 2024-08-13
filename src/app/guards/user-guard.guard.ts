import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { appsettings } from '../settings/appsettings';


import { jwtDecode } from "jwt-decode";


export const userGuardGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);



  const encryptionKey = appsettings.cryptoJs_secure_MD5_crypted_key;

  const token = cookieService.get('authToken');

  if (token) {
    try {
      // Desencriptar el token
      const decryptedToken = CryptoJS.AES.decrypt(token, encryptionKey).toString(CryptoJS.enc.Utf8);
      //console.log(decryptedToken);
      // Decodificar el token JWT
      const decodedToken: any = jwtDecode(decryptedToken);
      //console.log(decodedToken);
      // Obtener la fecha de expiración del token
      const exp = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

      // Verificar si el token ha expirado
      if (exp > currentTime) {
        return true; // Permite el acceso a la ruta
      } else {
        router.navigate(['']); // Redirige al usuario a la página de inicio
        return false; // Bloquea el acceso a la ruta
      }
    } catch (error) {
      console.error('Error al decodificar o verificar el token', error);
      router.navigate(['']); // Redirige al usuario a la página de inicio en caso de error
      return false; // Bloquea el acceso a la ruta
    }
  } else {
    router.navigate(['']); // Redirige al usuario a la página de inicio si no hay token
    return false; // Bloquea el acceso a la ruta
  }
};


