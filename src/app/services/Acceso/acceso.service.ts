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

import { EncryptService } from '../Encrypt/encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl
  constructor(private cookieService:CookieService, private router: Router,
  private _encrypt:EncryptService) { }

  Registro(objeto:Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.baseUrl}Acceso/Registro`,objeto)
  }

  Login(objeto:Login): Observable<ResponseAcceso>{
    const encryptedPassword = this._encrypt.encrypt(objeto.contrasena);
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

  }

}
