import { NumerosSorteos } from './../../../interfaces/NumerosSorteos';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Sorteo } from '../../../interfaces/Sorteo';
import { ResponseSorteo } from '../../../interfaces/ResponseSorteo';
import { EncryptedResponse } from '../../../interfaces/EncryptedResponse';
import { EncryptService } from '../../../services/Encrypt/encrypt.service';
import { SorteoService } from '../../../services/Sorteo/sorteo.service';

@Component({
  selector: 'app-award',
  standalone: true,
  imports: [
    NzSpinModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NzPopconfirmModule,
    CommonModule,
    NzButtonModule,
    NzCardModule,
  ],
  templateUrl: './award.component.html',
  styleUrl: './award.component.css',
})
export class AwardComponent {
  isVisible = false;
  isOkLoading = false;
  randomNumbers: number[] = [];
  intervalId: any;
  itGeneratingRandomNumbers = false;
  itsDisabledRandomButton = false;

  ticketForm: FormGroup;
  ticket: any;
  awardVisibility = false;
  blockAwardButton = false;

  @Input() Title: string = '';
  @Input() Description: string = '';
  @Input() DisableInputs: boolean = false;
  @Input() sorteo!: ResponseSorteo;

  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private _encriptadoService:EncryptService,
    private _sorteoService:SorteoService
  ) {
    this.ticketForm = this.fb.group({
      inputNum0: ['', Validators.required],
      inputNum1: ['', Validators.required],
      inputNum2: ['', Validators.required],
      inputNum3: ['', Validators.required],
      inputNum4: ['', Validators.required],
    });
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

    this.itGeneratingRandomNumbers = true;
    this.itsDisabledRandomButton = true;

    this.intervalId = setInterval(() => {
      // Genera números aleatorios y actualiza los controles del formulario
      for (let i = 0; i < 5; i++) {
        const randomValue = this.generateRandomNumber();
        this.ticketForm.controls[`inputNum${i}`].setValue(randomValue);
      }

      elapsed += intervalTime;

      // Detiene el intervalo después de 1 segundo y fija los valores finales
      if (elapsed >= 1000) {
        clearInterval(this.intervalId);
        for (let i = 0; i < 5; i++) {
          const randomValue = this.generateRandomNumber();
          this.ticketForm.controls[`inputNum${i}`].setValue(randomValue);
          this.randomNumbers[i] = randomValue;
        }

        const concatenatedString = this.randomNumbers.join('');
        const winner = parseInt(concatenatedString, 10);
        //console.log(winner);
        //console.log(concatenatedString);
        this.saveWinningNumber(winner);
        this.itGeneratingRandomNumbers = false;
        this.itsDisabledRandomButton = false;
      }
    }, intervalTime);
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 2) {
      inputElement.value = inputElement.value.slice(0, 2);
    }
  }

  /**
   * POP CONFIRM
   */

  cancel(): void {
    //this.nzMessageService.info('click cancel');
    this.awardVisibility = false;
    this.blockAwardButton = false;
    this.ticketForm.reset();
  }

  confirm(): void {
    this.awardVisibility = true;
    this.blockAwardButton = true;
    this.generateAndDisplayRandomNumbers();
    this.ticketForm.reset();
  }

  saveWinningNumber(winner: number) {
    //console.log(this.sorteo);
    var win: ResponseSorteo = this.sorteo;
    // Verifica si NumerosSorteos ya está inicializado
    if (!win.NumerosSorteos) {
      win.NumerosSorteos = []; // Inicializa como un array vacío si no lo es
    }
    const winNumber: NumerosSorteos = {
      SorteoID: win.SorteoId ?? 0, // Asegúrate de asignar un valor apropiado o default
      Numero: winner,
    };
    win.NumerosSorteos.push(winNumber);
    console.log(win);

    var jsonWinner = JSON.stringify(win);
    var encryptedWinner = this._encriptadoService.encrypt(jsonWinner);

    var enc:EncryptedResponse={
      response:encryptedWinner
    }

    this._sorteoService.WinSorteo(enc).subscribe({
      next:(data)=>{
        if(data.response){

        }else{
          console.error('ERROR: award.componenet.ts');
        }
      },error:(error)=>{
        console.error(error);
      }
    });

  }

}
