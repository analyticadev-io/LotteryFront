import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { ResponseSorteo } from '../../interfaces/ResponseSorteo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SorteoService {

  private http = inject(HttpClient)
  private baseUrl:string = appsettings.apiBaseUrl
  constructor() { }

  Sorteos(): Observable<ResponseSorteo>{
    return this.http.get<ResponseSorteo>(`${this.baseUrl}Sorteos`)
  }

}
