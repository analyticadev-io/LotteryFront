import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { EncryptedResponse } from '../../interfaces/EncryptedResponse';
import { EncryptService } from '../Encrypt/encrypt.service';
import { Boleto } from '../../interfaces/Boleto';


@Injectable({
  providedIn: 'root'
})
export class BoletoService {

  constructor() {

   }

  private http = inject(HttpClient)
  private encryptService = inject(EncryptService)
  private baseUrl:string = environment.apiUrl


  private ticketsSubject = new BehaviorSubject<Boleto[]>([]);
  public tickets$ = this.ticketsSubject.asObservable();


  BrowseModules():Observable<EncryptedResponse>{
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Boletos/`);
  }

  ReadBoleto(numBoleto:EncryptedResponse):Observable<EncryptedResponse>{
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Boletos/${numBoleto}`);
  }

  AddBoleto(boleto: EncryptedResponse): Observable<EncryptedResponse> {
    return this.http.post<EncryptedResponse>(`${this.baseUrl}Boletos/`, boleto).pipe(
      tap(() => {
        // Actualiza la lista de boletos después de agregar uno nuevo
        const userId = this.encryptService.decrypt(boleto.response);
        this.GetUserTickets(userId).subscribe();
      })
    );
  }

  GetUserTickets(userId: string): Observable<EncryptedResponse> {
    return this.http.get<EncryptedResponse>(`${this.baseUrl}Boletos/${userId}`).pipe(
      // Maneja la respuesta aquí si deseas hacer algo más
      tap(data => {
        if (data.response) {
          const decryptedResponse = this.encryptService.decrypt(data.response);
          const boletos = JSON.parse(decryptedResponse) as Boleto[];
          this.ticketsSubject.next(boletos);
          //console.log(boletos);
        }
      })
    );
  }


}
