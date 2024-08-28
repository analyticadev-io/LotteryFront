import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { ResponseSorteo } from '../../interfaces/ResponseSorteo';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EncryptedResponse } from '../../interfaces/EncryptedResponse';

@Injectable({
  providedIn: 'root'
})
export class SorteoService {

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl
  constructor() { }

  GetSorteos(): Observable<EncryptedResponse>{
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Sorteos`)
  }

  GetSorteo(id:number): Observable<ResponseSorteo>{
    return this.http.get<ResponseSorteo>(`${this.baseUrl}Sorteo/${id}`)
  }

  AddSorteo(sorteo:EncryptedResponse): Observable<EncryptedResponse>{
    return this.http.post<EncryptedResponse>(`${this.baseUrl}Sorteos`,sorteo)
  }

  EditSorteo(sorteo:EncryptedResponse): Observable<EncryptedResponse>{
    return this.http.put<EncryptedResponse>(`${this.baseUrl}Sorteos`,sorteo)
  }

  DeleteSorteo(id:string): Observable<EncryptedResponse>{
    return this.http.delete<EncryptedResponse>(`${this.baseUrl}Sorteos/${id}`)
  }

  WinSorteo(sorteo:EncryptedResponse): Observable<EncryptedResponse>{
    return this.http.put<EncryptedResponse>(`${this.baseUrl}Sorteos/win`,sorteo)
  }

}
