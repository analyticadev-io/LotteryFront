import { Injectable } from '@angular/core';
import { MenuOptions } from '../../interfaces/MenuOptions';
import { BehaviorSubject } from 'rxjs';
import { language } from '../../settings/language';
import { ModulesService } from '../Modules/modules.service';

@Injectable({
  providedIn: 'root',
})
export class MenuOptionsService {
  /**
   * Las opciens que controlaran dinamicamente las opciones del menu
   */

  public newMenu = new BehaviorSubject<MenuOptions[]>([]);

  constructor(private moduleService: ModulesService) {
    this.getDBModules();
  }

  private activeComponentSource = new BehaviorSubject<string>('');

  menuItems$ = this.newMenu.asObservable();
  activeComponent$ = this.activeComponentSource.asObservable();

  toggleVisibility(itemName: string): void {
    const updatedMenuItems = this.newMenu.value.map((item) => {
      item.visibilityStatus =
        item.module_name === itemName ? !item.visibilityStatus : false;
      return item;
    });
    this.newMenu.next(updatedMenuItems);

    const activeItem = updatedMenuItems.find((item) => item.visibilityStatus);
    this.activeComponentSource.next(activeItem ? activeItem.module_name : '');
  }

  getDBModules() {
    this.moduleService.GetModules().subscribe({
      next: (data) => {
        const menuObj: MenuOptions[] = data.map((module) => ({
          id: module.idModule,
          name: module.name, // Ajusta estos campos según el formato de los datos recibidos
          module_name: module.module_name,
          visibilityStatus: false,
          icon: module.icon || 'no-icon',
        }));
        this.newMenu.next(menuObj);
        console.log('servico menus', menuObj);
      },
      error: (error) => {},
    });
  }

  toggleToOffAllOptions() {
    // Mapea todos los items del menú y establece visibilityStatus en false
    const updatedMenuItems = this.newMenu.value.map((item) => {
      item.visibilityStatus = false;
      return item;
    });

    // Actualiza el BehaviorSubject con los items actualizados
    this.newMenu.next(updatedMenuItems);
    // Opcional: Si deseas que activeComponentSource también se desactive, puedes hacer:
    this.activeComponentSource.next('');
  }
}
