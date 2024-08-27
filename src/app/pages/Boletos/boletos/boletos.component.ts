import { Boleto } from './../../../interfaces/Boleto';
import { AccesoService } from './../../../services/Acceso/acceso.service';
import { Component, inject, ViewChild } from '@angular/core';
import { BoletoService } from '../../../services/Boleto/boleto.service';
import { SorteoService } from '../../../services/Sorteo/sorteo.service';
import { Sorteo } from '../../../interfaces/Sorteo';
import { EncryptService } from '../../../services/Encrypt/encrypt.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DatePipe } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ResponseSorteo } from '../../../interfaces/ResponseSorteo';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService  } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from '../../../interfaces/Usuario';

import moment from 'moment';
import { EncryptedResponse } from '../../../interfaces/EncryptedResponse';

@Component({
  selector: 'app-boletos',
  standalone: true,
  imports: [
    NzCardModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    DatePipe,
    NzModalModule,
    NzInputModule,
    FormsModule,
    NzSpinModule,
    NzPopconfirmModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,


  ],
  templateUrl: './boletos.component.html',
  styleUrl: './boletos.component.css',
})
export class BoletosComponent {
  sorteos: ResponseSorteo[] = [];
  ticket: any;
  currentUser: Usuario | null = null;
  ticketForm : FormGroup;

  /**
   *
   */
  constructor(
    private _boletoService: BoletoService,
    private _sorteoService: SorteoService,
    private _encriptService: EncryptService,
    private _accesoService: AccesoService,
    private nzMessageService: NzMessageService,
    private fb: FormBuilder,
  ) {

    this.ticketForm = this.fb.group({
      inputNum0: ['', Validators.required],
      inputNum1: ['', Validators.required],
      inputNum2: ['', Validators.required],
      inputNum3: ['', Validators.required],
      inputNum4: ['', Validators.required],
    });

    this.BrowseSorteos();
    this.loadCurrentUser();

  }

  BrowseSorteos() {
    this._sorteoService.GetSorteos().subscribe({
      next: (data) => {
        if (data.response) {
          var encryptedResponse = this._encriptService.decrypt(data.response);
          var objSorteos = JSON.parse(encryptedResponse) as ResponseSorteo[];
          this.sorteos = objSorteos;
          console.log(this.sorteos);
        } else {
          console.error('ERROR: bolrtos.component.ts');
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadCurrentUser(): void {
    this._accesoService.ObtainDecryptedInfo().subscribe(user => {
      this.currentUser = user;
      // Aquí puedes agregar lógica adicional si es necesario
      console.log('Current User:', this.currentUser);
    });
  }

  /**
   * MODAL Compra Boletos
   */
  isVisible = false;
  isOkLoading = false;
  randomNumbers: number[] = [];
  intervalId: any;
  itGeneratingRandomNumbers=false;
  itsDisabledRandomButton=false;

  showModal(sorteo?: ResponseSorteo): void {
    this.isVisible = true;
    this.ticket = sorteo;
  }

    handleOk(): void {
      this.isOkLoading = true;
      if(this.ticketForm.invalid){
        this.openSnackBar("Debe ingresar o generar los numeros de su boleto","OK");
        //this.isVisible = false;
        this.isOkLoading = false;
      }
      const ticketNumber: string = this.randomNumbers.join('');
      //console.log(this.ticketForm);
      //console.log(this.currentUser);
      //console.log(this.ticket);
      var ticketToBuy: Boleto ={
        UsuarioID:this.currentUser?.UsuarioId,
        SorteoID:this.ticket.SorteoId,
        FechaCompra:moment().toISOString(),
      }

      ticketToBuy.NumerosBoletos = [{
        Numero: Number(ticketNumber),
      }];
      //console.log(ticketNumber);
      //console.log(ticketToBuy);

      var jsonBoleto= JSON.stringify(ticketToBuy);
      var encryptedRequest = this._encriptService.encrypt(jsonBoleto);
      var enc:EncryptedResponse={
        response:encryptedRequest
      };
      this._boletoService.AddBoleto(enc).subscribe({
        next:(data)=>{
          if(data.response){
            console.log(data.response);
            this.isOkLoading = false;
            this.isVisible = false;
            this.openSnackBar("Tu boleto se a comprado con exito","OK");
          }
        },error:(error)=>{
          console.error(error);
        }
      });

    }

  handleCancel(): void {
    this.isVisible = false;
    this.randomNumbers = [];
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.value.length > 2) {
      inputElement.value = inputElement.value.slice(0, 2);
    }
  }

  // Esta función genera un número aleatorio entero entre 0 y 99.
  generateRandomNumber(): number {
    return Math.floor(Math.random() * 100);
  }

  // Esta función genera y muestra números aleatorios en intervalos de 100 ms durante 1 segundo.
  // Después de 1 segundo, se detiene el intervalo y se actualizan los números aleatorios una vez más.
  generateAndDisplayRandomNumbers(): void {
    let elapsed = 0;
    const intervalTime = 100; // Tiempo en milisegundos entre actualizaciones

    this.itGeneratingRandomNumbers=true;
    this.itsDisabledRandomButton=true;

    this.intervalId = setInterval(() => {
      // Actualiza los números aleatorios en los inputs
      this.randomNumbers = this.randomNumbers.map(() =>
        this.generateRandomNumber()
      );
      elapsed += intervalTime;

      // Detiene el intervalo después de 2 segundos y fija el valor final
      if (elapsed >= 1000) {
        clearInterval(this.intervalId);
        this.randomNumbers = this.randomNumbers.map(() =>
          this.generateRandomNumber()
        );
        this.itGeneratingRandomNumbers=false;
        this.itsDisabledRandomButton=false;
      }
    }, intervalTime);
  }

/**
 *SNACKBAR
 */
  private _snackBar = inject(MatSnackBar);
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }



}
