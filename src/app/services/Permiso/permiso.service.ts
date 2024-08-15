import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Permiso } from '../../interfaces/Permiso';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private http = inject(HttpClient)
  private baseUrl:string = appsettings.apiBaseUrl

  constructor() { }

  GetPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.baseUrl}Permisos`);
  }



}
