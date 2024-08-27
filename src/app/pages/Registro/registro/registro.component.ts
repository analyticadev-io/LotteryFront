import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccesoService } from '../../../services/Acceso/acceso.service';
import { Router } from '@angular/router';

import { language } from '../../../settings/language';
import { appsettings } from '../../../settings/appsettings';

import dayjs from 'dayjs';
import { Usuario } from '../../../interfaces/Usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  /**
   *
   */
  constructor() {
    this.getNow();
  }

  private AccesoService = inject(AccesoService);
  private router = inject(Router);
  private formBuild = inject(FormBuilder);
  public language: any = language;
  private date: any;
  private _snackBar = inject(MatSnackBar);

  public formRegister: FormGroup = this.formBuild.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
    nombreUsuario: ['', Validators.required],
  });

  getNow() {
    this.date = dayjs().format();
  }

  Registro() {
    if (this.formRegister.invalid) return;
    const object: Usuario = {
      Nombre: this.formRegister.value.nombre,
      email: this.formRegister.value.email,
      contrasena: this.formRegister.value.contrasena,
      nombreUsuario: this.formRegister.value.nombreUsuario,
      fechaRegistro: this.date
    };
    this.AccesoService.Registro(object).subscribe({
      next: (data) => {
        if (data.UsuarioId) {
          alert(language.alert_valid_registro);
          this.openSnackBar(this.language.alert_valid_registro);
          this.Inicio();
        } else {
          this.openSnackBar(this.language.alert_invalid_registro);
        }
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.language.alert_invalid_registro);
      },
    });
  }

  Inicio() {
    this.router.navigate(['']);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, language.button_action_close, {
      duration: appsettings.login_alert_duration_in_ss * 1000,
    });
  }


}
