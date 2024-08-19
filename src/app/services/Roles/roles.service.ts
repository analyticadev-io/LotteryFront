import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appsettings } from '../../settings/appsettings';
import { Rol } from '../../interfaces/Rol';
import { UsuarioRol } from '../../interfaces/UsuarioRol';
import { ResponseRolPermiso } from '../../interfaces/ResponseRolPermiso';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor() { }

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl

  GetRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.baseUrl}Roles`);
  }


  GetRol(id:number): Observable<Rol>{
    return this.http.get<Rol>(`${this.baseUrl}Roles/${id}`)
  }

  AddRol(obj:Rol): Observable<Rol>{
    return this.http.post<Rol>(`${this.baseUrl}Roles`,obj)
  }

  UpdateRol(obj:Rol): Observable<Rol>{
    return this.http.put<Rol>(`${this.baseUrl}Roles`,obj)
  }

  DeleteRol(rolId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Roles/${rolId}`);
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
