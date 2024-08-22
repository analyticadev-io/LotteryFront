import { Permiso } from './../../../interfaces/Permiso';
import { Rol } from './../../../interfaces/Rol';
import { Observable } from 'rxjs';
import { RolesService } from './../../../services/Roles/roles.service';

import {
  AfterViewInit,
  Component,
  inject,
  model,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { language } from '../../../settings/language';
import { appsettings } from '../../../settings/appsettings';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { askForPermission } from '../../../Directives/ask-for-permissions.directive';
import { MatChipsModule } from '@angular/material/chips';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { FormArray, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PermisoService } from '../../../services/Permiso/permiso.service';
import { ResponseRolPermiso } from '../../../interfaces/ResponseRolPermiso';
import { EncryptService } from '../../../services/Encrypt/encrypt.service';
import { EncryptedResponse } from '../../../interfaces/EncryptedResponse';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatDividerModule,
    MatIconModule,
    askForPermission,
    MatChipsModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent implements AfterViewInit {
  private _snackBar = inject(MatSnackBar);

  public language = language;
  public settings = appsettings;
  displayedColumns: string[] = [
    'rolId',
    'nombre',
    'permisos',
    'usuarios',
    'action',
  ];
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource<Rol>();

  form: FormGroup;
  modalOperationType: 'add' | 'edit' | 'delete' = 'add';
  modalData?: any;
  permisos: Permiso[] = [];
  response: ResponseRolPermiso[] = [];
  permisosArray: FormArray; // Nueva propiedad


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private permisoService: PermisoService,
    private _encryptService: EncryptService,
  ) {
    this.loadRoles();
    this.loadPermisos();
    this.form = this.fb.group({
      id: [''],
      name: ['',Validators.required],
      permisos: this.fb.array([]),
    });
    this.permisosArray = this.form.get('permisos') as FormArray;
  }

  /**
   *  Esta función privada crea controles de permisos a partir de una lista de permisos.
      Para cada permiso, se genera un control que se inicializa en 'false' y se almacena
      en un objeto con la clave 'permiso_' seguido del ID del permiso.
   *
   * @returns
   */
  private createPermissionControls(): { [key: string]: any } {
    const controls: { [key: string]: any } = {};
    this.permisos.forEach((permiso) => {
      controls['permiso_' + permiso.permisoId] = [false];
    });
    return controls;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   *Este método carga los roles desde el servicio y actualiza la fuente de datos.
    Si ocurre un error durante la carga, se registra en la consola.
   *
   * @memberof RolesComponent
   */
  loadRoles(): void {
    //console.log('Loading roles...');
    this.rolesService.GetRoles().subscribe(
      (roles: Rol[]) => {
        //console.log('Roles loaded:', roles);
        this.dataSource.data = roles;
      },
      (error) => {
        console.error('Error loading roles:', error);
      }
    );
  }

  /**
   *Este método carga los permisos desde el servicio de permisos y los organiza en un formulario reactivo.
    Si se proporciona un rol, marca los permisos correspondientes como seleccionados.
    Si la acción del modal es 'delete', desactiva el formulario.
   *
   * @param {Rol} [rol]
   * @memberof RolesComponent
   */
  loadPermisos(rol?: Rol): void {
    this.permisoService.GetPermisos().subscribe({
      next: (data) => {
        this.permisos = data;
        const permisosArray = this.permisosArray;
        permisosArray.clear(); // Limpiar permisos previos
        this.permisos.forEach((permiso) => {
          const permisoGroup = this.fb.group({
            permisoId: permiso.permisoId,
            descripcion: permiso.descripcion,
            checked: rol
              ? !!rol.Permisos?.find((p) => p.permisoId === permiso.permisoId)
              : false,
          });
          permisosArray.push(permisoGroup);
        });
        if (rol && this.modal_action === 'delete') {
          this.form.disable();
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }



  /**
   * Add - Edit - Delete Modal
   */

  isVisible = false;
  isOkLoading = false;
  nzTitle: string = '';
  modal_action: string = '';


  /**
   *Este método muestra un modal para agregar, editar o eliminar un rol.
    Dependiendo de la acción, se establece el título del modal y se carga la información del rol en un formulario.
    Si la acción es 'delete', el formulario se deshabilita para evitar cambios accidentales.
   *
   * @param {('add' | 'edit' | 'delete')} action
   * @param {Rol} [rol]
   * @memberof RolesComponent
   */
  showModal(action: 'add' | 'edit' | 'delete', rol?: Rol): void {
    this.isVisible = true;
    switch (action) {
      case 'add':
        this.nzTitle = 'Agregar'; // Title for adding
        this.modal_action = action;
        break;

      case 'edit':
        this.nzTitle = 'Editar'; // Title for editing
        this.modal_action = action;
        if (rol) {
          this.form.patchValue({ name: rol.nombre, id: rol.rolId }); // Setear el nombre del rol
          this.loadPermisos(rol); // Cargar los permisos del rol
        }
        break;

      case 'delete':
        this.nzTitle = 'Eliminar'; // Title for editing
        this.modal_action = action;
        if (rol) {
          this.form.patchValue({ name: rol.nombre, id: rol.rolId }); // Setear el nombre del rol
          this.loadPermisos(rol); // Cargar los permisos del rol
          this.form.disable(); // Deshabilitar el formulario
        }
        break;

      default:
        this.nzTitle = ''; // Default to empty or a fallback title
        break;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  /**
   * Este método maneja las acciones de un modal para agregar, editar o eliminar roles.
   * Dependiendo de la acción seleccionada, envía los datos correspondientes al backend y maneja las respuestas,
   * mostrando mensajes de éxito o error.
   * También se encarga de cargar los roles y permisos después de realizar las operaciones y restablece el formulario al final.
   * */
  handleOk(): void {
    this.isOkLoading = true;
    const permisosSeleccionados = this.form.value.permisos.filter(
      (permiso: any) => permiso.checked
    );
    //console.log(permisosSeleccionados);

    switch (this.modal_action) {
      case 'add':
        //console.log('voy a agregar');
        // Aquí puedes enviar los datos al backend
        let newRolPermiso: Rol = {
          //rolId:this.form.value.id,
          nombre: this.form.value.name,
          Permisos: permisosSeleccionados,
        };
        //console.log(newRolPermiso);

        const jsonStringNewRol = JSON.stringify(newRolPermiso);
        const encryptedNewRol = this._encryptService.encrypt(jsonStringNewRol);
        const crytp :EncryptedResponse={
          response:encryptedNewRol
        }

        if (this.form.invalid) return;
        this.rolesService.AddRol(crytp).subscribe({
          next: (data) => {
            if (data.response) {
              this.openSnackBar(this.language.alert_valid_add_roles);
              this.loadRoles();
              this.loadPermisos();
            } else {
              this.openSnackBar(this.language.alert_invalid_add_roles);
            }
          },
          error: (error) => {
            this.openSnackBar(
              this.language.alert_invalid_add_roles + '|:|' + error
            );
          },
        });
        this.isOkLoading = false;
        break;
      case 'edit':
        //console.log('voy a editar');
        // Aquí puedes enviar los datos al backend
        let updateRolPermiso: Rol = {
          rolId: this.form.value.id,
          nombre: this.form.value.name,
          Permisos: permisosSeleccionados,
        };
        //console.log(updateRolPermiso);

        const jsonStringupdateRol = JSON.stringify(updateRolPermiso);
        const encryptedupdateRol = this._encryptService.encrypt(jsonStringupdateRol);
        const crytpUpdate :EncryptedResponse={
          response:encryptedupdateRol
        }

        if (this.form.invalid && this.form.value.id!=0) return;
        this.rolesService.UpdateRol(crytpUpdate).subscribe({
          next: (data) => {
            console.log(data);
            if (data.response) {
              this.openSnackBar(this.language.alert_valid_update_roles);
              this.loadRoles();
              this.loadPermisos();
            } else {
              this.openSnackBar(this.language.alert_invalid_update_roles);
            }
          },
          error: (error) => {
            this.openSnackBar(
              this.language.alert_invalid_update_roles + '|:|' + error
            );
          },
        });
        this.isOkLoading = false;
        break;

        case 'delete':
        //console.log('voy a editar');
        //console.log(this.form.value.id);

        let id= this.form.value.id;
        id = id.toString();
        const encyptedId = this._encryptService.encrypt(id);
        if (this.form.invalid && this.form.value.id==0) return;
        this.rolesService.DeleteRol(encyptedId).subscribe({
          next: (data) => {
            if(data.response){
              this.language.alert_valid_delete_roles;
              this.loadRoles();
              this.loadPermisos();
            }else{
              this.openSnackBar(
                this.language.alert_invalid_delete_roles
              );
            }

          },
          error: (error) => {
            this.openSnackBar(
              this.language.alert_invalid_delete_roles + '|:|' + error
            );
          },
        });
        this.isOkLoading = false;
        this.form.enable();
        break;

      default:
        this.nzTitle = ''; // Default to empty or a fallback title
        break;
    }
    this.form.reset();
    this.isVisible = false;
  }

  /**
   * Metodo apra mostrar mensajes de feedback
   * @param message
   */
  openSnackBar(message: string) {
    this._snackBar.open(message, language.button_action_close, {
      duration: appsettings.login_alert_duration_in_ss,
    });
  }

}


