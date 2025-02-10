import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../general/services/auth.service';

@Component({
  selector: 'admin',
  imports: [NavComponent, RouterLink, ButtonModule, CommonModule, MenuModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  toggle: boolean = true;
  items: MenuItem[] | undefined = [];
  constructor(private authSrv: AuthService, private router: Router) { }
  ngOnInit() {
    this.items = [
      {
        label: localStorage.getItem('username') ?? '',
        disabled: true,
      },
      {
        label: 'Logout',
        command: () => {
          this.router.navigate(['login'])
        }
      },
    ];
  }
}
