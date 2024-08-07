
import { Router } from '@angular/router';
import { AccesoService } from './../../../services/Acceso/acceso.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../../interfaces/Login';
import { language } from '../../../settings/language';

import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private AccesoService = inject(AccesoService);
  private router = inject(Router);
  private formBuild = inject(FormBuilder);
  public titleLogin: string = language.title_login;
  public language: any=language;


  public formLogin: FormGroup = this.formBuild.group({
    NombreUsuario: ['', Validators.required,Validators.email],
    contrasena: ['', Validators.required],
  });

  Login() {
    if (this.formLogin.invalid) return;
    const obj: Login = {
      NombreUsuario:this.formLogin.value.NombreUsuario,
      contrasena: this.formLogin.value.contrasena,
    };
    this.AccesoService.Login(obj).subscribe({
      next:(data)=>{
        if(data.isSuccess){
          localStorage.setItem("token",data.token)
          this.router.navigate(['home'])
        }else{
          alert(language.alert_invalid_login)
        }
      },error:(error)=>{
        console.log(error)
      }
    })
  }

  Registro(){
    this.router.navigate(['registro'])
  }


}
