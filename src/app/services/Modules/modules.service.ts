import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Observable } from 'rxjs';
import { MenuOptions } from '../../interfaces/MenuOptions';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl



  constructor() { }

  GetModules(): Observable<MenuOptions[]> {
    return this.http.get<MenuOptions[]>(`${this.baseUrl}Modules`);
  }

  AddModule(obj:MenuOptions): Observable<MenuOptions>{
    return this.http.post<MenuOptions>(`${this.baseUrl}Modules`,obj)
  }

  EditModule(obj:MenuOptions): Observable<MenuOptions>{
    return this.http.put<MenuOptions>(`${this.baseUrl}Modules`,obj)
  }

  DeleteModule(module: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Modules/${module}`);
  }

}
