import { Component } from '@angular/core';
import { APIResponse } from '../../../../general/interfaces/response';
import { ActivatedRoute, Router } from '@angular/router';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { ToastService } from '../../../../general/services/toast.service';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { forkJoin, switchMap } from 'rxjs';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';

@Component({
  selector: 'app-user-edit',
  imports: [DynmaicFormComponent, AdTemplateComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  userId?: number;
  constructor(
    roleSrv: RoleService,
    private userSrv: UserService,
    private msgSrv: ToastService,
    private router: Router,
    route: ActivatedRoute) {
    route.params.pipe(
      switchMap(param => {
        this.userId = +param['id'];
        return forkJoin({ roles: roleSrv.getAll(), user: userSrv.getById(param['id']) });
      })
    ).subscribe(res => {
      this.objs = {
        general: [
          {
            key: 'userName',
            label: 'Username',
            value: res.user.data.userName,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'newPassword',
            label: 'Password',
            value: res.user.data.password,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'roleId',
            label: 'Role',
            value: res.user.data.role.roleId,
            dataType: 'list',
            options: (res.roles.data as any[]).map(role => {
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
    this.userSrv.edit(event.general, this.userId ?? 0).subscribe((res: APIResponse) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.router.navigate(['admin/user']);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
