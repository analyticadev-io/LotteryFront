import { Injectable } from '@angular/core';
import { MenuOptions } from '../../interfaces/MenuOptions';
import { BehaviorSubject } from 'rxjs';
import { language } from '../../settings/language';

@Injectable({
  providedIn: 'root'
})
export class MenuOptionsService {

  private menuItemsSource = new BehaviorSubject<MenuOptions[]>([
    { name: language.menu_option_Roles, visibilityStatus: false, icon:"lock" }
  ]);

  constructor() { }

  private activeComponentSource = new BehaviorSubject<string>('');

  menuItems$ = this.menuItemsSource.asObservable();
  activeComponent$ = this.activeComponentSource.asObservable();

  toggleVisibility(itemName: string): void {
    const updatedMenuItems = this.menuItemsSource.value.map(item => {
      item.visibilityStatus = (item.name === itemName) ? !item.visibilityStatus : false;
      return item;
    });
    this.menuItemsSource.next(updatedMenuItems);

    const activeItem = updatedMenuItems.find(item => item.visibilityStatus);
    this.activeComponentSource.next(activeItem ? activeItem.name : '');
  }

}
