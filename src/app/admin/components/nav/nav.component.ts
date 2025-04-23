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
            icon: 'pi pi-users',
            route: ['/admin/employee'],
          },
          {
            label: 'COO',
            icon: 'pi pi-briefcase', 
            route: ['/admin/coo'],
          },
          {
            label: 'User',
            icon: 'pi pi-user',
            route: ['/admin/user'],
          }
        ],
      },
      {
        label: 'Setting',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Rate',
            route: ['/admin/setting'],
            fragment: 'Rate',
            icon: 'pi pi-dollar', 
          },
          {
            label: 'Type of contract',
            route: ['/admin/setting'],
            fragment: 'Type of contract',
            icon: 'pi pi-file', 
          },
          {
            label: 'City',
            route: ['/admin/setting'],
            fragment: 'City',
            icon: 'pi pi-map-marker', 
          },
          {
            label: 'Bank',
            route: ['/admin/setting'],
            fragment: 'Bank',
            icon: 'pi pi-credit-card', 
          },
          {
            label: 'Company Account',
            route: ['/admin/setting'],
            fragment: 'Company Account',
            icon: 'pi pi-user', 
          },
          {
            label: 'Client',
            route: ['/admin/setting'],
            fragment: 'Client',
            icon: 'pi pi-id-card', 
          },
          {
            label: 'Team',
            route: ['/admin/setting'],
            fragment: 'Team',
            icon: 'pi pi-users', 
          },
          {
            label: 'Laptop',
            route: ['/admin/setting'],
            fragment: 'Laptop',
            icon: 'pi pi-desktop', 
          },
          {
            label: 'Compensation',
            route: ['/admin/setting'],
            fragment: 'Compensation',
            icon: 'pi pi-money-bill', 
          },
          {
            label: 'Leave Days',
            route: ['/admin/setting'],
            fragment: 'Leave Days',
            icon: 'pi pi-calendar-times', 
          },
        ]
      },
      {
        label: 'Report',
        shortcut: '⌘+O',
        icon: 'pi pi-chart-bar',
        items: [
          {
            label: 'invoice',
            route: ['/admin/report/invoice'],
          }
        ]
      },
    ];
  }
}
