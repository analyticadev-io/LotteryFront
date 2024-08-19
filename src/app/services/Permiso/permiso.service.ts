import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Permiso } from '../../interfaces/Permiso';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl

  constructor() { }

  GetPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.baseUrl}Permisos`);
  }



}
