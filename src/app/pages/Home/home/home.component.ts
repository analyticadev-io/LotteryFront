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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  activeComponent$ = this.menuService.activeComponent$;
  menuItems$ = this.menuService.menuItems$;
  public language = language;
  boleto: Boleto[] = [];

  encryptedToken = this.cookieService.get('userinfo');
  public currentUser: Usuario = {} as Usuario;
  constructor(
    private menuService: MenuOptionsService,
    private cookieService: CookieService,
    private accesoService:AccesoService,
    private __encryptService:EncryptService,
    private _boletoService:BoletoService
  ) {}

  ngOnInit(): void {

    this.decryptUserInfo(this.encryptedToken);
    this.obtainTickets();
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

  obtainTickets(){

    var userId = this.currentUser.UsuarioId ?? "";
    var idString:string = userId?.toString();
    var encryptedId= this.__encryptService.encrypt(idString);

    var encRequest:EncryptedResponse={
      response:encryptedId
    }

    console.log(this.currentUser);
    this._boletoService.GetUserTickets(encRequest.response).subscribe({
      next:(data)=>{
        if(data.response){
          var decryptResponse = this.__encryptService.decrypt(data.response);
          this.boleto = JSON.parse(decryptResponse) as Boleto[];
          console.log(this.boleto);



        }
      },error:(error)=>{

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

  showModal(): void {
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

}
