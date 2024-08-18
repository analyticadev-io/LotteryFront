import { Injectable } from '@angular/core';
import { MenuOptions } from '../../interfaces/MenuOptions';
import { BehaviorSubject } from 'rxjs';
import { language } from '../../settings/language';
import { ModulesService } from '../Modules/modules.service';

@Injectable({
  providedIn: 'root'
})
export class MenuOptionsService {


  /**
   * Las opciens que controlaran dinamicamente las opciones del menu
   *
   * { name: language.menu_option_display_name_Roles, //nombre delacrado en ela rchivo de lenguaje
      module_name: language.menu_option_module_name_Roles, //identificador delacrado en ela rchivo de lenguaje
      visibilityStatus: false,  //inicializado en false apra no mostrar nada por defecto
      icon:"lock" //icono, se usa ngzorro icons
    }
   *
   */

    public newMenu= new BehaviorSubject<MenuOptions[]>([])

  // private menuItemsSource = new BehaviorSubject<MenuOptions[]>([
  //   { name: language.menu_option_display_name_Roles,
  //     module_name: language.menu_option_module_name_Roles,
  //     visibilityStatus: false,
  //     icon:"lock"
  //   },
  //   { name: language.menu_option_display_name_Modules,
  //     module_name: language.menu_option_module_name_Modules,
  //     visibilityStatus: false,
  //     icon:"unlock"
  //   },
  //   { name: "Modulo de prueba",
  //     module_name: "nuevaPrueba",
  //     visibilityStatus: false,
  //     icon:"small-dash"
  //   },
  // ]);

  constructor(private moduleService: ModulesService) {
    this.getDBModules();
   }

  private activeComponentSource = new BehaviorSubject<string>('');

  menuItems$ = this.newMenu.asObservable();
  activeComponent$ = this.activeComponentSource.asObservable();

  toggleVisibility(itemName: string): void {

    const updatedMenuItems = this.newMenu.value.map(item => {
      item.visibilityStatus = (item.module_name === itemName) ? !item.visibilityStatus : false;
      return item;
    });
    this.newMenu.next(updatedMenuItems);

    const activeItem = updatedMenuItems.find(item => item.visibilityStatus);
    this.activeComponentSource.next(activeItem ? activeItem.module_name : '');
  }

  getDBModules(){
    this.moduleService.GetModules().subscribe({
      next:(data)=>{
        const menuObj: MenuOptions[] = data.map(module => ({
          id:module.idModule,
          name: module.name, // Ajusta estos campos según el formato de los datos recibidos
          module_name: module.module_name,
          visibilityStatus: false, // Inicializado en false o según tus necesidades
          icon: module.icon || "no-icon" // Usa un valor predeterminado si no se proporciona
        }));
        this.newMenu.next(menuObj);
        console.log('servico menus',menuObj);
      },error:(error)=>{

      }
    });
  }

}
