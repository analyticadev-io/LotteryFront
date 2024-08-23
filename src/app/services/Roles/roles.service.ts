import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appsettings } from '../../settings/appsettings';
import { Rol } from '../../interfaces/Rol';
import { UsuarioRol } from '../../interfaces/UsuarioRol';
import { ResponseRolPermiso } from '../../interfaces/ResponseRolPermiso';
import { environment } from '../../../environments/environment';
import { EncryptedResponse } from '../../interfaces/EncryptedResponse';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor() { }

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl

  GetRoles(): Observable<EncryptedResponse> {
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Roles`);
  }


  GetRol(id:number): Observable<Rol>{
    return this.http.get<Rol>(`${this.baseUrl}Roles/${id}`)
  }

  AddRol(crypt:EncryptedResponse): Observable<EncryptedResponse>{
    return this.http.post<EncryptedResponse>(`${this.baseUrl}Roles`,crypt)
  }

  UpdateRol(obj:EncryptedResponse): Observable<EncryptedResponse>{
    return this.http.put<EncryptedResponse>(`${this.baseUrl}Roles`,obj)
  }

  DeleteRol(rolId: string): Observable<EncryptedResponse> {
    return this.http.delete<EncryptedResponse>(`${this.baseUrl}Roles/${rolId}`);
  }

  AsignRol(obj:UsuarioRol): Observable<string>{
    return this.http.post<string>(`${this.baseUrl}Roles/asignar-rol`,obj)
  }

  EditRolAsigned(obj:UsuarioRol): Observable<string>{
    return this.http.put<string>(`${this.baseUrl}Roles/editar-rol`,obj)
  }

  DeleteRolAsigned(obj:UsuarioRol): Observable<string>{
    return this.http.put<string>(`${this.baseUrl}Roles/eliminar-rol`,obj)
  }

}
