import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

//Material components
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NativeDateModule } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';



//ReactiveForms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//Solicitudes Http
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

//dayJS
import * as dayjs from 'dayjs';



//NG Zorro
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en'
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';


//Components
import { HomeComponent } from './pages/Home/home/home.component';
import { LoginComponent } from './pages/Login/login/login.component';
import { RegistroComponent } from './pages/Registro/registro/registro.component';
import { DrawerComponent } from './components/Drawer/drawer/drawer.component';
import { RolesComponent } from './pages/Roles/roles/roles.component';

//NGX cookie service
import {CookieService} from 'ngx-cookie-service';

//CryptoJS
import * as CryptoJS from 'crypto-js';

//jwt_decode
import jwt_decode from 'jwt-decode';

//
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { jwtInterceptorInterceptor } from './interceptors/jwt-interceptor.interceptor';

registerLocaleData(en);


@NgModule({
  declarations: [


  ],
  imports: [
    BrowserModule,
    //Material
    MatButtonModule,MatPaginatorModule,MatTableModule,ReactiveFormsModule,
    MatInputModule,MatSelectModule,MatDatepickerModule,NativeDateModule,
    MatSnackBarModule,MatIconModule,MatDialogModule,MatGridListModule,FormsModule,
    MatCardModule,NzLayoutModule,

    //Http
    HttpClientModule,


    //NGZORRO
    NzDrawerModule,NzIconModule,NzButtonModule,NzGridModule,

    //componentes
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    DrawerComponent,
    RolesComponent,
    //
    //AppComponent

  ],
  providers: [
    provideAnimationsAsync(),
    { provide: NZ_I18N, useValue: en_US },
    provideHttpClient(),
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: jwtInterceptorInterceptor, multi: true },
  ],
  //bootstrap: [AppComponent]
})
export class AppModule {

 }
