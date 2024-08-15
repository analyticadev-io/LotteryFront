import { Injectable } from '@angular/core';
import { MenuOptions } from '../../interfaces/MenuOptions';
import { BehaviorSubject } from 'rxjs';
import { language } from '../../settings/language';

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

  private menuItemsSource = new BehaviorSubject<MenuOptions[]>([
    { name: language.menu_option_display_name_Roles,
      module_name: language.menu_option_module_name_Roles,
      visibilityStatus: false,
      icon:"lock"
    }
  ]);

  constructor() { }

  private activeComponentSource = new BehaviorSubject<string>('');

  menuItems$ = this.menuItemsSource.asObservable();
  activeComponent$ = this.activeComponentSource.asObservable();

  toggleVisibility(itemName: string): void {

    const updatedMenuItems = this.menuItemsSource.value.map(item => {
      item.visibilityStatus = (item.module_name === itemName) ? !item.visibilityStatus : false;
      return item;
    });
    this.menuItemsSource.next(updatedMenuItems);

    const activeItem = updatedMenuItems.find(item => item.visibilityStatus);
    this.activeComponentSource.next(activeItem ? activeItem.module_name : '');
  }

}
