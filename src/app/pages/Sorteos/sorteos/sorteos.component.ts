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
import {MatDatepickerModule} from '@angular/material/datepicker';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CalendarModule } from 'primeng/calendar';

import moment from 'moment-timezone';

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
  ],
  templateUrl: './sorteos.component.html',
  styleUrl: './sorteos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[provideNativeDateAdapter()]
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
  isDisabled = true; // o true dependiendo de la lógica

  /**
   *
   */
  constructor(private _sorteosService: SorteoService,private fb: FormBuilder) {
    this.form = this.fb.group({
      sorteoId: [''],
      descripcion: ['',Validators.required],
      fechaSorteo: [null,Validators.required]
    });

  }
  ngOnInit(): void {
    this.getSorteos();
  }

  public getSorteos(): void {
    this._sorteosService.GetSorteos().subscribe({
      next: (data: ResponseSorteo[]) => {
        //console.log('Fetched sorteos:', data); // Confirm data is fetched
        this.dataSource.data = data;
        this.loading = false;
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

  showModal(action: string, model?:ResponseSorteo): void {
    this.isVisible = true;
    const dateObject = moment(model?.fechaSorteo).tz('America/Guayaquil').toDate();
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
            sorteoId: model?.sorteoId,
            descripcion: model?.descripcion,
            fechaSorteo: dateObject
          });
          break;

          case appsettings.delete_permission_text:
            //console.log();
            this.modalAction = action;
            this.modalTitle = language.modal_delete_action_title_Sorteos;
            this.form.patchValue({
              sorteoId: model?.sorteoId,
              descripcion: model?.descripcion,
              fechaSorteo: dateObject
            });
            break;

      default:
        this.isVisible = false;
        break;
    }


  }

  handleOk(): void {
    //console.log(this.form);
    this.isOkLoading = true;

    let fecha = this.getFormattedDate(this.form.value.fechaSorteo)
    switch(this.modalAction){
      case appsettings.add_permission_text:
          if(this.form.invalid) return;
          let newSorteo:ResponseSorteo={
            descripcion:this.form.value.descripcion,
            fechaSorteo:fecha,
          }
          //console.log(newSorteo);
          this._sorteosService.AddSorteo(newSorteo).subscribe({
            next:(data)=>{
              this.getSorteos();
            },error:(error)=>{
              console.error(error);
            }
          });
        break;

        case appsettings.edit_permission_text:
          if(this.form.invalid && this.form.value.sorteoId!=null) return;
          let editSorteo:ResponseSorteo={
            sorteoId:this.form.value.sorteoId,
            descripcion:this.form.value.descripcion,
            fechaSorteo:fecha,
          }
          //console.log(editSorteo);
          this._sorteosService.EditSorteo(editSorteo).subscribe({
            next:(data)=>{
              this.getSorteos();
            },error:(error)=>{
              console.log(error);
            }
          });
        break;

        case appsettings.delete_permission_text:
          if(this.form.invalid && this.form.value.sorteoId!=null) return;
          this._sorteosService.DeleteSorteo(this.form.value.sorteoId).subscribe({
            next:(data)=>{
              this.getSorteos();
            },error:(error)=>{
              console.log(error);
            }
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
    return moment(dateString).tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');
  }

}
