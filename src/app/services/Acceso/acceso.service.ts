import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Usuario } from '../../interfaces/Usuario';
import { Observable } from 'rxjs';
import { ResponseAcceso } from '../../interfaces/ResponseAcceso';
import { Login } from '../../interfaces/Login';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { MenuOptionsService } from '../MenuOptions/menu-options.service';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl
  constructor(private cookieService:CookieService, private router: Router, private _menuoptionsService:MenuOptionsService) { }


  encrypt(data: string): string {
    const key = CryptoJS.enc.Hex.parse('5b05196eb7aa7f487ad6de85828e1b09');
    const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

decrypt(encryptedData: string): string {
  const key = CryptoJS.enc.Hex.parse('5b05196eb7aa7f487ad6de85828e1b09');
  const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}


  Registro(objeto:Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.baseUrl}Acceso/Registro`,objeto)
  }

  Login(objeto:Login): Observable<ResponseAcceso>{
    const encryptedPassword = this.encrypt(objeto.contrasena);
    // Reemplaza la contraseña en el objeto con la versión encriptada
    const loginData = { ...objeto, contrasena: encryptedPassword };
    //console.log(encryptedPassword);
    //console.log(loginData);
    return this.http.post<ResponseAcceso>(`${this.baseUrl}Acceso/Login`,loginData)
  }

  LogOut(){
    this.cookieService.deleteAll();
    localStorage.clear();
    this.router.navigate(['']);
    this._menuoptionsService.toggleToOffAllOptions();
  }

}
