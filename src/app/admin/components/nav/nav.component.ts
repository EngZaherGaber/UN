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
            icon: 'pi pi-briefcase', // More suitable for COO (Chief Operating Officer)
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
            icon: 'pi pi-dollar', // For financial rates
          },
          {
            label: 'Type of contract',
            route: ['/admin/setting'],
            fragment: 'Type of contract',
            icon: 'pi pi-file', // Represents documents/contracts
          },
          {
            label: 'City',
            route: ['/admin/setting'],
            fragment: 'City',
            icon: 'pi pi-map-marker', // For locations
          },
          {
            label: 'Bank',
            route: ['/admin/setting'],
            fragment: 'Bank',
            icon: 'pi pi-credit-card', // Already correct for bank
          },
          {
            label: 'Company Account',
            route: ['/admin/setting'],
            fragment: 'Company Account',
            icon: 'pi pi-user', // Already correct for bank
          },
          {
            label: 'Client',
            route: ['/admin/setting'],
            fragment: 'Client',
            icon: 'pi pi-id-card', // For client identification
          },
          {
            label: 'Team',
            route: ['/admin/setting'],
            fragment: 'Team',
            icon: 'pi pi-users', // For groups of people
          },
          {
            label: 'Laptop',
            route: ['/admin/setting'],
            fragment: 'Laptop',
            icon: 'pi pi-desktop', // For computer equipment
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
