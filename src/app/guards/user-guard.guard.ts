import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { appsettings } from '../settings/appsettings';


import { jwtDecode } from "jwt-decode";
import { AccesoService } from '../services/Acceso/acceso.service';


export const userGuardGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const _accesoService = inject(AccesoService);
  const router = inject(Router);

  const token = cookieService.get('authToken');
  //console.log('token en el guard   '+ token)
  if (token) {

    try{
    const decryptedToken = _accesoService.decrypt(token)
    //console.log('token desencriptado '+ decryptedToken);
    const decodedToken: any = jwtDecode(decryptedToken);
    //console.log(decodedToken);
    const exp = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
      // Verificar si el token ha expirado
      if (exp > currentTime) {
        return true; // Permite el acceso a la ruta
      } else {
        router.navigate(['']); // Redirige al usuario a la página de inicio
        return false; // Bloquea el acceso a la ruta
      }

    }catch(Error){
    console.error("Guard: verificar el token" +Error)
    router.navigate(['']);
    return false;
    }

  } else {
    router.navigate(['']); // Redirige al usuario a la página de inicio si no hay token
    return false; // Bloquea el acceso a la ruta
  }
};


