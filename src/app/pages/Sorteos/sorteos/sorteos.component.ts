import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SorteoService } from '../../../services/Sorteo/sorteo.service';
import { ResponseSorteo } from '../../../interfaces/ResponseSorteo';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { language } from '../../../settings/language';
import { appsettings } from '../../../settings/appsettings';
import { askForPermission } from '../../../Directives/ask-for-permissions.directive';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CalendarModule } from 'primeng/calendar';

import moment from 'moment-timezone';
import { EncryptService } from '../../../services/Encrypt/encrypt.service';
import { Sorteo } from '../../../interfaces/Sorteo';
import { EncryptedResponse } from '../../../interfaces/EncryptedResponse';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AwardComponent } from '../../../components/Award/award/award.component';

@Component({
  selector: 'app-sorteos',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatFormFieldModule,
    askForPermission,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CalendarModule,
    FloatLabelModule,
    AwardComponent,
  ],
  templateUrl: './sorteos.component.html',
  styleUrl: './sorteos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class SorteosComponent implements OnInit {
  sorteos: ResponseSorteo[] = [];
  loading: boolean = true;
  public language = language;
  public settings = appsettings;
  displayedColumns: string[] = [
    'sorteoId',
    'fechaSorteo',
    'descripcion',
    'title',
    'status',
    'boletos',
    'numerosSorteos',
    'action',
  ];

  dataSource: MatTableDataSource<ResponseSorteo> =
    new MatTableDataSource<ResponseSorteo>();

  isVisible = false;
  isOkLoading = false;
  modalTitle = '';
  modalAction = '';

  form: FormGroup;
  isDisabled = true;
  selectedSorteo: ResponseSorteo = {} as ResponseSorteo;

  /**
   *
   */
  constructor(
    private _sorteosService: SorteoService,
    private fb: FormBuilder,
    private _encriptadoSerivice: EncryptService
  ) {
    this.form = this.fb.group({
      sorteoId: [''],
      title: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaSorteo: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.getSorteos();
  }

  public getSorteos(): void {
    this._sorteosService.GetSorteos().subscribe({
      next: (data) => {
        if (data.response) {
          var encryptedResponse = this._encriptadoSerivice.decrypt(
            data.response
          );
          var objSorteos = JSON.parse(encryptedResponse) as ResponseSorteo[];
          this.dataSource.data = objSorteos;
          this.loading = false;
          //console.log(encryptedResponse);
          console.log(objSorteos);
        } else {
        }

        //console.log('Fetched sorteos:', data); // Confirm data is fetched
      },
      error: (error) => {
        console.error('Error fetching sorteos:', error);
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showModal(action: string, model?: ResponseSorteo): void {
    this.isVisible = true;
    const dateObject = moment(model?.FechaSorteo)
      .tz('America/Guayaquil')
      .toDate();
    switch (action) {
      case appsettings.add_permission_text:
        this.modalAction = action;
        this.modalTitle = language.modal_add_action_title_Sorteos;
        break;

      case appsettings.edit_permission_text:
        //console.log();
        this.modalAction = action;
        this.modalTitle = language.modal_edit_action_title_Sorteos;
        this.form.patchValue({
          sorteoId: model?.SorteoId,
          title: model?.Title,
          descripcion: model?.Descripcion,
          fechaSorteo: dateObject,
        });
        break;

      case appsettings.delete_permission_text:
        //console.log();
        this.modalAction = action;
        this.modalTitle = language.modal_delete_action_title_Sorteos;
        this.form.patchValue({
          sorteoId: model?.SorteoId,
          title: model?.Title,
          descripcion: model?.Descripcion,
          fechaSorteo: dateObject,
        });
        break;

        case appsettings.award_permission_text:

          if(model){
            this.modalAction = action;
            this.modalTitle = model?.Title ?? '';
            this.selectedSorteo = model;
            //console.log(this.selectedSorteo);
          }else{
            return;
          }
          break;

      default:
        this.isVisible = false;
        break;
    }
  }

  handleOk(): void {
    //console.log(this.form);
    this.isOkLoading = true;

    let fecha = this.getFormattedDate(this.form.value.fechaSorteo);
    switch (this.modalAction) {
      case appsettings.add_permission_text:
        if (this.form.invalid) return;
        let newSorteo: ResponseSorteo = {
          Title: this.form.value.title,
          Descripcion: this.form.value.descripcion,
          FechaSorteo: fecha,
        };
        //console.log(newSorteo);

        var jsonSorteo = JSON.stringify(newSorteo);
        var encryptedRequest = this._encriptadoSerivice.encrypt(jsonSorteo);
        var request : EncryptedResponse={
          response:encryptedRequest
        }

        this._sorteosService.AddSorteo(request).subscribe({
          next: (data) => {
            if(data.response){
              this.getSorteos();
              this.form.reset();
            }else{
              console.error("ERROR: sorteos.component.ts  **ADD ACTION**");
            }

          },
          error: (error) => {
            console.error(error);
          },
        });
        break;

      case appsettings.edit_permission_text:
        if (this.form.invalid && this.form.value.sorteoId != null) return;
        let editSorteo: ResponseSorteo = {
          SorteoId: this.form.value.sorteoId,
          Title: this.form.value.title,
          Descripcion: this.form.value.descripcion,
          FechaSorteo: fecha,
        };
        var jsonRequest = JSON.stringify(editSorteo);
        var encryptedRequest = this._encriptadoSerivice.encrypt(jsonRequest);
        var request : EncryptedResponse={
          response:encryptedRequest
        }
        //console.log(editSorteo);
        this._sorteosService.EditSorteo(request).subscribe({
          next: (data) => {
            if(data.response){
              this.getSorteos();
              this.form.reset();
            }else{
              console.error("ERROR: sorteos.component.ts  **EDIT ACTION**");
            }

          },
          error: (error) => {
            console.error(error);
          },
        });
        break;

      case appsettings.delete_permission_text:
        if (this.form.invalid && this.form.value.sorteoId != null) return;
        var id:number = this.form.value.sorteoId;
        var encryptedId = this._encriptadoSerivice.encrypt(id.toString())
        this._sorteosService.DeleteSorteo(encryptedId).subscribe({
          next: (data) => {
            if(data.response){
              this.getSorteos();
              this.form.reset();
            }else{
              console.error("ERROR: sorteos.component.ts  **DELETE ACTION**");
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
        break;

      default:
        this.isVisible = false;
        this.isOkLoading = false;
        break;
    }

    this.isVisible = false;
    this.isOkLoading = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getFormattedDate(dateString: string): string {
    return moment(dateString)
      .tz('America/Guayaquil')
      .format('YYYY-MM-DD HH:mm:ss');
  }

  onRefreshSorteos() {
    this.getSorteos();
    console.log('se emitio el eveto');
  }

}
