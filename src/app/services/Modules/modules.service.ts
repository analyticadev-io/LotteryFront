import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Observable } from 'rxjs';
import { MenuOptions } from '../../interfaces/MenuOptions';
import { environment } from '../../../environments/environment';
import { EncryptedResponse } from '../../interfaces/EncryptedResponse';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl



  constructor() { }

  GetModules(): Observable<EncryptedResponse> {
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Modules`);
  }

  AddModule(obj:EncryptedResponse): Observable<EncryptedResponse>{
    return this.http.post<EncryptedResponse>(`${this.baseUrl}Modules`,obj)
  }

  EditModule(obj:EncryptedResponse): Observable<EncryptedResponse>{
    return this.http.put<EncryptedResponse>(`${this.baseUrl}Modules`,obj)
  }

  DeleteModule(module: EncryptedResponse): Observable<EncryptedResponse> {
    return this.http.delete<EncryptedResponse>(`${this.baseUrl}Modules/${module.response}`);
  }

}
