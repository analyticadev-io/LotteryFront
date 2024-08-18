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
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  activeComponent$ = this.menuService.activeComponent$;
  public language = language;
  public encryptionKey = appsettings.cryptoJs_secure_MD5_crypted_key;
  encryptedToken = this.cookieService.get('userinfo');
  public currentUser: Usuario = {} as Usuario;
  constructor(
    private menuService: MenuOptionsService,
    private cookieService: CookieService,
    private accesoService:AccesoService
  ) {}

  ngOnInit(): void {
    this.decryptUserInfo(this.encryptedToken);
  }

  decryptUserInfo(userCookie: string) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        this.encryptedToken,
        this.encryptionKey
      );
      const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      this.currentUser = decryptedUser as Usuario;
      console.log(this.currentUser);
    } catch (error) {}
  }

  onLogOut() {
    this.accesoService.LogOut();
  }


}
