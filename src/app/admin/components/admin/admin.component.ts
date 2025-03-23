import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { InputDynamic } from '../../../general/interfaces/input-dynamic';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../../general/services/toast.service';
import { APIResponse } from '../../../general/interfaces/response';
import { DynmaicFormComponent } from '../../../general/components/dynmaic-form/dynmaic-form.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'admin',
  imports: [DialogModule, NavComponent, DynmaicFormComponent, RouterLink, ButtonModule, CommonModule, MenuModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  toggle: boolean = true;
  items: MenuItem[] | undefined = [];
  resetObjs: { [key: string]: InputDynamic[] } = {};
  showChangePasswordDialog: boolean = false;
  constructor(
    private msgSrv: ToastService,
    private usrSrv: UserService,
  ) { }
  ngOnInit() {
    this.items = [
      {
        label: localStorage.getItem('username') ?? '',
        disabled: true,
      },
      {
        label: 'Change Password',
        command: () => {
          this.showChangePasswordDialog = true
        }
      },
      {
        label: 'Logout',
        routerLink: ['login']
      },
    ];
    this.resetObjs = {
      general: [
        {
          key: 'oldPassword',
          label: 'Old Password',
          value: null,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'newPassword',
          label: 'New Password',
          value: null,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'userId',
          label: '',
          value: localStorage.getItem('userId'),
          dataType: 'string',
          visible: false,
          options: [],
        },
      ],
    }
  }
  submit(event: any) {
    this.usrSrv.resetPassword(event.general).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    });
  }
}
