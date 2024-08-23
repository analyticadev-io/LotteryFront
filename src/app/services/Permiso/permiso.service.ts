import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Permiso } from '../../interfaces/Permiso';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EncryptedResponse } from '../../interfaces/EncryptedResponse';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl

  constructor() { }

  GetPermisos(): Observable<EncryptedResponse> {
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Permisos`);
  }



}
