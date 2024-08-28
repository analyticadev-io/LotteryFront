import { language } from './../../../settings/language';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { DrawerComponent } from '../../../components/Drawer/drawer/drawer.component';
import { RolesComponent } from '../../Roles/roles/roles.component';
import { MenuOptionsService } from '../../../services/MenuOptions/menu-options.service';
import { appsettings } from '../../../settings/appsettings';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../../../interfaces/Usuario';
import { ModulesComponent } from '../../Modules/modules/modules.component';
import {MatIconModule} from '@angular/material/icon';


import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { AccesoService } from '../../../services/Acceso/acceso.service';
import { SorteosComponent } from '../../Sorteos/sorteos/sorteos.component';
import { EncryptService } from '../../../services/Encrypt/encrypt.service';

import { BoletosComponent } from '../../Boletos/boletos/boletos.component';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BoletoService } from '../../../services/Boleto/boleto.service';
import { EncryptedResponse } from '../../../interfaces/EncryptedResponse';
import { Boleto } from '../../../interfaces/Boleto';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { map, Observable, of } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NzLayoutModule,
    DrawerComponent,
    RolesComponent,
    CommonModule,
    NzGridModule,
    ModulesComponent,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    SorteosComponent,
    BoletosComponent,
    NzBadgeModule,
    NzIconModule,
    NzModalModule,
    NzCardModule,
    NzButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  activeComponent$ = this.menuService.activeComponent$;
  menuItems$ = this.menuService.menuItems$;
  public language = language;
  //boleto: Boleto[] = [];


  modalAction:string="";
  modalTitle:string="";

  boleto$: Observable<Boleto[]> = this._boletoService.tickets$;


  activeTicketsCount: number = 0;
  completeTicketsCount: number = 0;

  activeTickets$: Observable<Boleto[]> = of([]);
  completeTickets$: Observable<Boleto[]> = of([]);


  encryptedToken = this.cookieService.get('userinfo');
  public currentUser: Usuario = {} as Usuario;
  constructor(
    private menuService: MenuOptionsService,
    private cookieService: CookieService,
    private accesoService:AccesoService,
    private __encryptService:EncryptService,
    private _boletoService:BoletoService
  ) {

    console.log(this.boleto$);

  }

  ngOnInit(): void {

    this.decryptUserInfo(this.encryptedToken);
    this.loadTickets();

    this.activeTickets$ = this.boleto$.pipe(
      map(boletos => boletos.filter(boleto => boleto.Sorteo?.Status === 'active'))
    );

    this.completeTickets$ = this.boleto$.pipe(
      map(boletos => boletos.filter(boleto => boleto.Sorteo?.Status === 'complete'))
    );

    // Suscribirse a los observables para actualizar los contadores
    this.activeTickets$.subscribe(tickets => this.activeTicketsCount = tickets.length);
    this.completeTickets$.subscribe(tickets => this.completeTicketsCount = tickets.length);

    console.log('activos: ',this.activeTickets$);
    console.log('completos: ', this.completeTickets$);

  }

  decryptUserInfo(userCookie: string) {
    try {
      const decryptedUser =this.__encryptService.decrypt(this.encryptedToken);
      this,this.currentUser = JSON.parse(decryptedUser) as Usuario;
      //console.log('usuario en el home',this.currentUser);
    } catch (error) {
      console.error(error);
    }
  }

  loadTickets() {
    const userId = this.currentUser.UsuarioId ?? '';
    const encryptedId = this.__encryptService.encrypt(userId.toString());

    // Obtener directamente la respuesta si lo necesitas
    this._boletoService.GetUserTickets(encryptedId).subscribe({
      next: (data) => {
        //console.log('Direct response:', data);
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
      }
    });
  }


  onLogOut() {
    this.accesoService.LogOut();
  }

  count(boleto: Boleto[]): number {
    return boleto ? boleto.length : 0; // Maneja el caso cuando boleto sea undefined
  }

  /**
   * Modal
   */

  isVisible = false;

  showModal(action:string): void {

    switch(action){
      case 'active':
        this.modalAction=action;
        this.modalTitle="Tickets por sortear";
      break;

      case 'complete':
        this.modalAction=action;
        this.modalTitle="Tickets sorteados";
      break;

      default:
        break;
    }

    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  isWinningNumber(numero: number, numerosSorteos: { Numero: number }[] | undefined): boolean {
    return numerosSorteos?.some(n => n.Numero === numero) ?? false;
  }

}
