import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Usuario } from '../../interfaces/Usuario';
import { Observable, of } from 'rxjs';
import { ResponseAcceso } from '../../interfaces/ResponseAcceso';
import { Login } from '../../interfaces/Login';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { EncryptService } from '../Encrypt/encrypt.service';
import { EncryptedResponse } from '../../interfaces/EncryptedResponse';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient);
  private baseUrl:string = environment.apiUrl;

  private user: Usuario | null = null;

  constructor(private cookieService:CookieService, private router: Router,
  private _encrypt:EncryptService) { }

  Registro(objeto:Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.baseUrl}Acceso/Registro`,objeto)
  }

  Login(objeto:EncryptedResponse): Observable<ResponseAcceso>{
    return this.http.post<ResponseAcceso>(`${this.baseUrl}Acceso/Login`,objeto)
  }

  LogOut(){
    this.cookieService.deleteAll();
    localStorage.clear();
    this.router.navigate(['']);

  }

  ObtainDecryptedInfo(): Observable<Usuario | null> {
    const userCrypted = this.cookieService.get('userinfo');
    if (userCrypted) {
      try {
        const decryptedUser = this._encrypt.decrypt(userCrypted);
        const objUser = JSON.parse(decryptedUser) as Usuario;
        this.user = objUser;
        return of(this.user);
      } catch (error) {
        console.error('Error decrypting user info:', error);
        return of(null);
      }
    }
    return of(null);
  }

  getCurrentUser(): Usuario | null {
    return this.user;
  }




}
