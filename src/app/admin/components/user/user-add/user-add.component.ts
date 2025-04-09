import { Component } from '@angular/core';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  imports: [AdTemplateComponent, DynmaicFormComponent],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.scss'
})
export class UserAddComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  constructor(private roleSrv: RoleService, private userSrv: UserService, private msgSrv: ToastService, private router: Router) {
    this.roleSrv.getAll().subscribe(res => {
      this.objs = {
        general: [
          {
            key: 'userName',
            label: 'Username',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'password',
            label: 'Password',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'roleId',
            label: 'Role',
            value: null,
            dataType: 'list',
            options: (res.data as any[]).map(role => {
              return { id: role.roleId, name: role.roleName }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
        ],
      };

    })
  }
  submit(event: any) {
    this.userSrv.add(event).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.router.navigate(['admin/user']);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
