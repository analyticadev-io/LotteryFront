import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuOptionsService } from '../../../services/MenuOptions/menu-options.service';
import { language } from '../../../settings/language';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MenuOptions } from '../../../interfaces/MenuOptions';

import { askForPermission } from '../../../Directives/ask-for-permissions.directive';
import { appsettings } from '../../../settings/appsettings';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [NzDrawerModule,NzButtonModule,CommonModule,NzIconModule,askForPermission],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent {

  menuItems$ = this.menuService.menuItems$;
  public language: any=language;
  public settings: any=appsettings;

  constructor(private menuService: MenuOptionsService) {
    //console.log(this.menuItems$);
  }
  visible = false;
  open(): void {
    this.visible = true;
  }
  close(): void {
    this.visible = false;
  }
toggleVisibility(itemName: string): void {
    //console.log(itemName);
    this.menuService.toggleVisibility(itemName);
  }

}
