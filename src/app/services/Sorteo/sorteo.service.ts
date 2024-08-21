import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { ResponseSorteo } from '../../interfaces/ResponseSorteo';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SorteoService {

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl
  constructor() { }

  GetSorteos(): Observable<ResponseSorteo[]>{
    return this.http.get<ResponseSorteo[]>(`${this.baseUrl}Sorteos`)
  }

  GetSorteo(id:number): Observable<ResponseSorteo>{
    return this.http.get<ResponseSorteo>(`${this.baseUrl}Sorteo/${id}`)
  }

  AddSorteo(sorteo:ResponseSorteo): Observable<ResponseSorteo>{
    return this.http.post<ResponseSorteo>(`${this.baseUrl}Sorteos`,sorteo)
  }

  EditSorteo(sorteo:ResponseSorteo): Observable<ResponseSorteo>{
    return this.http.put<ResponseSorteo>(`${this.baseUrl}Sorteos`,sorteo)
  }

  DeleteSorteo(id:number): Observable<ResponseSorteo>{
    return this.http.delete<ResponseSorteo>(`${this.baseUrl}Sorteos/${id}`)
  }

}
