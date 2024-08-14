import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, Renderer2, ElementRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../interfaces/Usuario';
import { Permiso } from '../interfaces/Permiso';
import { appsettings } from '../settings/appsettings';

@Directive({
  selector: '[askForPermission]',
  standalone:true
})
export class askForPermission implements OnInit {

  @Input('askForPermission') requiredPermission!: string;
  private encryptionKey: string = appsettings.cryptoJs_secure_MD5_crypted_key;
  private encryptedToken = this.cookieService.get('userinfo');
  public currentUser: Usuario = {} as Usuario;
  private elementId: string = '';

  constructor(
    private cookieService: CookieService,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    console.log(this.requiredPermission);
    this.decryptUserInfo(this.encryptedToken);
    this.checkPermission();
  }

  decryptUserInfo(userCookie: string) {
    try {
      const bytes = CryptoJS.AES.decrypt(userCookie, this.encryptionKey);
      const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      this.currentUser = decryptedUser as Usuario;
    } catch (error) {
      console.error('Error decrypting user info', error);
      this.viewContainer.clear();
    }
  }

  checkPermission() {
    if (!this.currentUser.rol || !Array.isArray(this.currentUser.rol)) {
      this.viewContainer.clear();
      return;
    }

    const hasPermission = this.currentUser.rol.some((rol) => {
      if (!Array.isArray(rol.permisos)) {
        return false;
      }
      return rol.permisos.some((permiso: Permiso) => permiso.descripcion === this.requiredPermission);
    });

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      //this.showElement(); // Ensure the element is visible
    } else {
      this.viewContainer.clear();
    }
  }

}
