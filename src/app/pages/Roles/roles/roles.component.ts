import { Rol } from './../../../interfaces/Rol';
import { Observable } from 'rxjs';
import { RolesService } from './../../../services/Roles/roles.service';

import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,CommonModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements AfterViewInit {



  displayedColumns: string[] = ['rolId', 'nombre', 'permisos', 'usuarios'];
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource<Rol>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private rolesService: RolesService) {
    this.loadRoles();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadRoles(): void {
    //console.log('Loading roles...');
    this.rolesService.GetRoles().subscribe(
      (roles: Rol[]) => {
        console.log('Roles loaded:', roles);
        this.dataSource.data = roles;
      },
      error => {
        console.error('Error loading roles:', error);
      }
    );
  }

}


