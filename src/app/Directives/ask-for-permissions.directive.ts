import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, Renderer2, ElementRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { Usuario } from '../interfaces/Usuario';
import { Permiso } from '../interfaces/Permiso';
import { appsettings } from '../settings/appsettings';

import { EncryptService } from '../services/Encrypt/encrypt.service';

@Directive({
  selector: '[askForPermission]',
  standalone:true
})
export class askForPermission implements OnInit {

  @Input('askForPermission') requiredPermission!: string;
  private encryptionKey: string = appsettings.cryptoJs_secure_MD5_crypted_key;
  private encryptedUser = this.cookieService.get('userinfo');
  public currentUser: Usuario = {} as Usuario;
  private elementId: string = '';

  constructor(
    private cookieService: CookieService,
    private _encryptService: EncryptService,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    //console.log(this.requiredPermission);
    this.decryptUserInfo(this.encryptedUser);
    this.checkPermission();
  }

  decryptUserInfo(userCookie: string) {
    try {
      const decryptedUser = this._encryptService.decrypt(this.encryptedUser)
      this.currentUser = JSON.parse(decryptedUser) as Usuario;
      //console.log('usuario en la direciva: ',this.currentUser );
    } catch (error) {
      console.error('Error decrypting user info', error);
      this.viewContainer.clear();
    }
  }


  checkPermission() {
    if (!this.currentUser.Rol || this.currentUser.Rol.length === 0) {
      this.viewContainer.clear();
      console.error('No tiene el rol', this.currentUser);
      return;
    }

    const hasPermission = this.currentUser.Rol.some((rol) => {
      if (!rol.Permisos || rol.Permisos.length === 0) {
        console.error('Rol sin permisos:', rol);
        return false;
      }

      return rol.Permisos.some((permiso: any) => permiso.Descripcion === this.requiredPermission);
    });

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
      console.error('El usuario no tiene el permiso requerido:', this.requiredPermission);
    }
  }



}
