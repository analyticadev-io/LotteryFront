import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuOptions } from '../../interfaces/MenuOptions';
import { ModulesService } from '../Modules/modules.service';

@Injectable({
  providedIn: 'root',
})
export class MenuOptionsService {
  // BehaviorSubject para mantener el estado de las opciones del menú
  public newMenu = new BehaviorSubject<MenuOptions[]>([]);
  private activeComponentSource = new BehaviorSubject<string>('');

  constructor(private moduleService: ModulesService) {
    this.getDBModules();
    //console.log('estoy en el servicio opciones');
  }

  // Observable para observar los cambios en las opciones del menú
  menuItems$ = this.newMenu.asObservable();
  activeComponent$ = this.activeComponentSource.asObservable();

  // Método para alternar la visibilidad de un ítem del menú
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

  // Método para desactivar todas las opciones del menú
  toggleToOffAllOptions() {
    const updatedMenuItems = this.newMenu.value.map((item) => {
      item.visibilityStatus = false;
      return item;
    });
    this.newMenu.next(updatedMenuItems);
    this.activeComponentSource.next('');
  }
}
