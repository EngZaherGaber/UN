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
            icon: 'pi pi-user', // Represents a person or employee
            shortcut: '⌘+N',
            route: ['/admin/employee'],
          },
          {
            label: 'Contract',
            icon: 'pi pi-file', // Represents a document or contract
            shortcut: '⌘+S',
          },
          {
            label: 'COO',
            icon: 'pi pi-briefcase', // Represents a briefcase, suitable for a COO
            shortcut: '⌘+S',
          },
          {
            label: 'Team',
            icon: 'pi pi-users', // Represents a group or team of people
            shortcut: '⌘+S',
          },
          {
            label: 'Bank',
            icon: 'pi pi-credit-card', // Represents finance or banking
            shortcut: '⌘+S',
          },
        ],
      },
      {
        label: 'Config',
        icon: 'pi pi-cog', // Suitable for configuration settings
        shortcut: '⌘+O',
      },
      {
        label: 'Report',
        icon: 'pi pi-chart-line', // Represents analytics or reporting
        shortcut: '⌘+O',
      },
    ];
  }
}
