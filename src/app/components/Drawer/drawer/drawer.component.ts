import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MenuOptionsService } from '../../../services/MenuOptions/menu-options.service';
import { language } from '../../../settings/language';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MenuOptions } from '../../../interfaces/MenuOptions';

import { askForPermission } from '../../../Directives/ask-for-permissions.directive';
import { appsettings } from '../../../settings/appsettings';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [NzDrawerModule,NzButtonModule,CommonModule,NzIconModule,askForPermission],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent implements OnInit, OnDestroy {

  menuItems: MenuOptions[] = [];
  public language: any=language;
  public settings: any=appsettings;
  private menuItemsSubscription: Subscription = new Subscription();

  constructor(private menuService: MenuOptionsService) {

  }

  ngOnInit(): void {
    // Suscríbete al observable para obtener los ítems del menú
    this.menuItemsSubscription = this.menuService.menuItems$.subscribe(
      items => {
        this.menuItems = items;
        //console.log('menu en el drawer init ', this.menuItems);
      }
    );
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar pérdidas de memoria
    this.menuItemsSubscription.unsubscribe();
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
