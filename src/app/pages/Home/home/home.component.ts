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
    SorteosComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  activeComponent$ = this.menuService.activeComponent$;
  menuItems$ = this.menuService.menuItems$;
  public language = language;

  encryptedToken = this.cookieService.get('userinfo');
  public currentUser: Usuario = {} as Usuario;
  constructor(
    private menuService: MenuOptionsService,
    private cookieService: CookieService,
    private accesoService:AccesoService,
    private __encryptService:EncryptService
  ) {}

  ngOnInit(): void {
    this.decryptUserInfo(this.encryptedToken);
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

  onLogOut() {
    this.accesoService.LogOut();
  }


}
