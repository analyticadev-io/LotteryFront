import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Usuario } from '../../interfaces/Usuario';
import { Observable } from 'rxjs';
import { ResponseAcceso } from '../../interfaces/ResponseAcceso';
import { Login } from '../../interfaces/Login';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient)
  private baseUrl:string = appsettings.apiBaseUrl
  constructor() { }

  Registro(objeto:Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.baseUrl}Acceso/Registro`,objeto)
  }

  Login(objeto:Login): Observable<ResponseAcceso>{
    return this.http.post<ResponseAcceso>(`${this.baseUrl}Acceso/Login`,objeto)
  }

}
