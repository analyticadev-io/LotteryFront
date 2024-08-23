
import { Router } from '@angular/router';
import { AccesoService } from './../../../services/Acceso/acceso.service';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Login } from '../../../interfaces/Login';
import { language } from '../../../settings/language';
import { appsettings } from '../../../settings/appsettings';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { DecryptedResponse } from '../../../interfaces/DecryptedResponse';
import { EncryptService } from '../../../services/Encrypt/encrypt.service';
import { EncryptedResponse } from '../../../interfaces/EncryptedResponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  /**
   *
   */
  constructor(private cookieService: CookieService) {}

  private AccesoService = inject(AccesoService);
  private _encryptService = inject(EncryptService);
  private router = inject(Router);
  private formBuild = inject(FormBuilder);
  public language: any = language;
  private _snackBar = inject(MatSnackBar);
  private encryptionKey: string = appsettings.cryptoJs_secure_MD5_crypted_key;

  public formLogin: FormGroup = this.formBuild.group({
    NombreUsuario: ['', Validators.required],
    contrasena: ['', Validators.required],
  });

  Login() {
    if (this.formLogin.invalid) return;
    const obj: Login = {
      NombreUsuario: this.formLogin.value.NombreUsuario,
      contrasena: this.formLogin.value.contrasena,
    };

    let jsonRequest = JSON.stringify(obj);
    let encryptedRequest = this._encryptService.encrypt(jsonRequest);
    let loginEncrypted : EncryptedResponse={
      response:encryptedRequest
    };

    this.AccesoService.Login(loginEncrypted).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          const encryptedResponse = data.encryptedResponse;
          const decryptedResponse =
            this._encryptService.decrypt(encryptedResponse);
          const objResponse = JSON.parse(decryptedResponse);
          //console.log(objResponse);
          const token = objResponse.Token;
          //console.log('token original',token);
          const userInfo = objResponse.Usuario;
          const encryptedToken = this._encryptService.encrypt(token);
          const encryptUser = this._encryptService.encrypt(JSON.stringify(userInfo));
          //console.log('usuario cifrado: '+encryptUser );
          this.cookieService.set('authToken', encryptedToken, { secure: true });
          this.cookieService.set('userinfo', encryptUser, { secure: true });
          this.router.navigate(['home']);

        } else {
          this.openSnackBar(this.language.alert_invalid_login);
        }
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.language.alert_invalid_login);
      },
    });
  }

  Registro() {
    this.router.navigate(['registro']);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, language.button_action_close, {
      duration: appsettings.login_alert_duration_in_ss * 1000,
    });
  }
}
