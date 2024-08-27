import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { EncryptedResponse } from '../../interfaces/EncryptedResponse';


@Injectable({
  providedIn: 'root'
})
export class BoletoService {

  constructor() { }

  private http = inject(HttpClient)
  private baseUrl:string = environment.apiUrl


  BrowseModules():Observable<EncryptedResponse>{
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Boletos/`);
  }

  ReadBoleto(numBoleto:EncryptedResponse):Observable<EncryptedResponse>{
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Boletos/${numBoleto}`);
  }

  AddBoleto(boleto:EncryptedResponse):Observable<EncryptedResponse>{
    return this.http.post<EncryptedResponse>(`${this.baseUrl}Boletos/`,boleto);
  }

  GetUserTickets(userId:string):Observable<EncryptedResponse>{
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Boletos/${userId}`);
  }



}
