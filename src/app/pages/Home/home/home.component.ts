import { Component } from '@angular/core';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { DrawerComponent } from '../../../components/Drawer/drawer/drawer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NzLayoutModule,DrawerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {



}
