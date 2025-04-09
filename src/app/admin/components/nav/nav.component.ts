import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'admin-nav',
  imports: [PanelMenuModule, CommonModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  items: MenuItem[] | undefined = [];
  ngOnInit() {
    this.items = [
      {
        label: 'Management',
        icon: 'pi pi-building-columns',
        shortcut: '⌘+O',
        items: [
          {
            label: 'Employee',
            route: ['/admin/employee'],
          },
          {
            label: 'Contract',
          },
          {
            label: 'COO',
            route: ['/admin/coo'],
          },
          {
            label: 'User',
            icon: 'pi pi-person',
            route: ['/admin/user'],
          }
        ],
      },
      {
        label: 'Setting',
        icon: 'pi pi-cog', // Suitable for configuration settings
        route: ['/admin/setting']
      },
      {
        label: 'Report',
        icon: 'pi pi-chart-line', // Represents analytics or reporting
        shortcut: '⌘+O',
      },
    ];
  }
}
