import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MenuOptions } from '../../../interfaces/MenuOptions';
import { ModulesService } from '../../../services/Modules/modules.service';
import { MenuOptionsService } from '../../../services/MenuOptions/menu-options.service';
import { appsettings } from '../../../settings/appsettings';
import { language } from '../../../settings/language';
import { askForPermission } from '../../../Directives/ask-for-permissions.directive';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { EncryptService } from '../../../services/Encrypt/encrypt.service';
import { EncryptedResponse } from '../../../interfaces/EncryptedResponse';


interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatCardModule,
    askForPermission,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
})
export class ModulesComponent {
  modules: MenuOptions[] = [];
  menuItems: MenuOptions[] = [];
  filteredMenuItems: MenuOptions[] = [];

  displayedColumns: string[] = ['name','module_name','icon', 'action'];
  dataSource = new MatTableDataSource<MenuOptions>(this.menuItems);
  public settings = appsettings;
  public language = language;

  isVisible = false;
  isOkLoading = false;
  nzTitle: string = '';
  modal_action: string = '';

  form: FormGroup;

  selectedValue: string = '';

  private formBuild = inject(FormBuilder);

  constructor(
    private moduleService: ModulesService,
    private menuService: MenuOptionsService,
    private fb: FormBuilder,
    private _encryptService:EncryptService
  ) {
    this.getModules();

    this.form = this.fb.group({
      name: ['', Validators.required],
      last_name: [''],
      module_name: ['', Validators.required],
      icon: ['', Validators.required],
    });

    this.form.get('name')?.valueChanges.subscribe(value => {
      const camelCaseValue = this.toCamelCase(value);
      this.form.get('module_name')?.setValue(camelCaseValue, { emitEvent: false });
    });
  }

  onModuleChange(selectedModuleName: string): void {
    this.form.get('module_name')?.setValue(selectedModuleName);
  }

  getModules(): void {
    this.moduleService.GetModules().subscribe({
      next: (data) => {
        if(data.response){
          let decryptMenu = this._encryptService.decrypt(data.response);
          let objMenu = JSON.parse(decryptMenu)as MenuOptions[];
          this.modules = objMenu;
          this.dataSource.data = this.modules;
        }else{
          console.error('Error: Modules component: ',this.modules)
        }

      },
      error: (error: any) => {
        console.error('Error al obtener los módulos:', error);
      },
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showModal(action: string, option?: MenuOptions): void {
    this.isVisible = true;
    this.modal_action = action;
    switch (this.modal_action) {
      case this.settings.add_permission_text:
        this.nzTitle = this.language.modal_add_action_title;
        break;

      case this.settings.edit_permission_text:
        //console.log(option);
        this.form.patchValue({ last_name: option?.module_name });
        this.nzTitle = this.language.modal_edit_action_title;

        break;

        case this.settings.delete_permission_text:
          console.log(option);
          this.form.patchValue({ last_name: option?.IdModule, name: option?.Name, module_name:option?.module_name, icon:option?.icon });
          this.nzTitle = this.language.modal_delete_action_title;

          break;

      default:
        this.nzTitle = '';
        break;
    }
  }

  handleOk(): void {
    this.isOkLoading = true;

    switch (this.modal_action) {
      case this.settings.add_permission_text:
        if (this.form.invalid) return;
        const object: MenuOptions = {
          Name: this.form.value.name,
          module_name: this.form.value.module_name,
          icon:this.form.value.icon,
          visibilityStatus:"false",
        };

        var jsonRequest = JSON.stringify(object);
        var crypt = this._encryptService.encrypt(jsonRequest);
        var encryptedRequest : EncryptedResponse={
          response:crypt
        };

        this.moduleService.AddModule(encryptedRequest).subscribe({
          next: (data) => {
            //console.log(data);
            if(data.response){
              var decryptResponse = this._encryptService.decrypt(data.response);
              console.log(decryptResponse);
              this.form.reset();
              this.getModules();
            }

          },
          error: (error) => {
            console.error(error);
          },
        });

        break;

      case this.settings.edit_permission_text:
        //console.log(this.form);
        if (this.form.invalid) return;
        const editModule: MenuOptions = {
          Name: this.form.value.name,
          module_name: this.form.value.module_name,
          last_module_name: this.form.value.last_name,
          icon: this.form.value.icon,
          visibilityStatus:"false"
        };

        var jsonRequest = JSON.stringify(editModule);
        var crypt = this._encryptService.encrypt(jsonRequest);
        var encryptedRequest : EncryptedResponse={
          response:crypt
        };

        this.moduleService.EditModule(encryptedRequest).subscribe({
          next: (data) => {
            this.getModules();
            this.form.reset();
            //console.log(data);
          },
          error: (error) => {
            console.error(error);
          },
        });

        break;

        case this.settings.delete_permission_text:
          if (this.form.invalid) return;
          var id:number = this.form.value.last_name
          var encryptId = this._encryptService.encrypt(id.toString());
          var encryptedRequest : EncryptedResponse={
            response:encryptId
          };

          this.moduleService.DeleteModule(encryptedRequest).subscribe({
            next: (data) => {
              //console.log(data);
              if(data.response){
                this.form.reset();
                this.getModules();
              }else{
                console.error("ERROR: DELETE--Modules.compenent.ts");
              }

            },
            error: (error) => {
              console.error(error);
            },
          });


        break;
      default:
        break;
    }
    this.isOkLoading = false;
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, '');
  }
}
