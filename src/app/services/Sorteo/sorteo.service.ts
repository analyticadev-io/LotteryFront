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

  Sorteos(): Observable<ResponseSorteo>{
    return this.http.get<ResponseSorteo>(`${this.baseUrl}Sorteos`)
  }

}
