import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuOptions } from '../../interfaces/MenuOptions';
import { ModulesService } from '../Modules/modules.service';
import { EncryptService } from '../Encrypt/encrypt.service';

@Injectable({
  providedIn: 'root',
})
export class MenuOptionsService {
  // BehaviorSubject para mantener el estado de las opciones del menú
  public newMenu = new BehaviorSubject<MenuOptions[]>([]);
  private activeComponentSource = new BehaviorSubject<string>('');

  constructor(private moduleService: ModulesService, private _encryptservice:EncryptService) {
    this.getDBModules();
    //console.log('estoy en el servicio opciones');
  }

  // Observable para observar los cambios en las opciones del menú
  menuItems$ = this.newMenu.asObservable();
  activeComponent$ = this.activeComponentSource.asObservable();

  // Método para alternar la visibilidad de un ítem del menú
  // toggleVisibility(itemName: string): void {
  //   const updatedMenuItems = this.newMenu.value.map((item) => {
  //     item.visibilityStatus =
  //       item.module_name === itemName ? !item.visibilityStatus : "false";
  //     return item;
  //   });
  //   this.newMenu.next(updatedMenuItems);

  //   const activeItem = updatedMenuItems.find((item) => item.visibilityStatus);
  //   this.activeComponentSource.next(activeItem ? activeItem.module_name : '');
  // }

  toggleVisibility(itemName: string): void {
    const updatedMenuItems = this.newMenu.value.map((item) => {
      item.visibilityStatus =
        item.module_name === itemName
          ? (item.visibilityStatus === "true" ? "false" : "true") // Cambia entre "true" y "false"
          : item.visibilityStatus;
      return item;
    });
    this.newMenu.next(updatedMenuItems);

    const activeItem = updatedMenuItems.find((item) => item.visibilityStatus === "true");
    this.activeComponentSource.next(activeItem ? activeItem.module_name : '');
  }


  getDBModules() {
    this.moduleService.GetModules().subscribe({
      next: (data) => {
        if(data.response){
          let decryptedResponse = this._encryptservice.decrypt(data.response);
          //console.log(decryptedResponse)
          let objMenu = JSON.parse(decryptedResponse) as MenuOptions[];
          //console.log('obj menus', objMenu);
          const menuObj: MenuOptions[] = objMenu.map((module) => ({
            id: module.IdModule,
            Name: module.Name, // Ajusta estos campos según el formato de los datos recibidos
            module_name: module.module_name,
            visibilityStatus: "false",
            icon: module.icon || 'no-icon',
          }));
          this.newMenu.next(menuObj);
          //console.log('servico menus', menuObj);
        }else{
          console.error("ERROR: obtaninig response menu-options.service.ts");
        }

      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // Método para desactivar todas las opciones del menú
  toggleToOffAllOptions() {
    const updatedMenuItems = this.newMenu.value.map((item) => {
      item.visibilityStatus = "false";
      return item;
    });
    this.newMenu.next(updatedMenuItems);
    this.activeComponentSource.next('');
  }
}
