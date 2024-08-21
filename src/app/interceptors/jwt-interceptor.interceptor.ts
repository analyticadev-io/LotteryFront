import { AccesoService } from './../services/Acceso/acceso.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { appsettings } from '../settings/appsettings';
import * as CryptoJS from 'crypto-js';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  //console.log('entre al interceptor');
  const cookieService = inject(CookieService);
  const _accesoService = inject(AccesoService);
  const encryptionKey = appsettings.cryptoJs_secure_MD5_crypted_key;

  const encryptedToken = cookieService.get('authToken');
  //console.log('token encriptado en el interceptor',encryptedToken);
  let request=req;

  if(encryptedToken){

    try{

      // Desencriptar el token
      //const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, encryptionKey).toString(CryptoJS.enc.Utf8);
      const decryptedToken = _accesoService.decrypt(encryptedToken);

      //console.log('token desencriptado en el interceptor',decryptedToken);
      // Clonar la solicitud y añadir la cabecera Authorization con el token JWT
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${decryptedToken}`
        }
      });

    }catch(error){
      console.error('Error al desencriptar el token:', error);
    }

  }

  return next(request);
};
