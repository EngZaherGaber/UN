import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, forkJoin } from 'rxjs';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { RoleService } from '../../../services/role.service';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';

@Component({
  selector: 'app-user-display',
  imports: [DynmaicFormComponent, AdTemplateComponent],
  templateUrl: './user-display.component.html',
  styleUrl: './user-display.component.scss'
})
export class UserDisplayComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  constructor(
    roleSrv: RoleService,
    userSrv: UserService,
    route: ActivatedRoute) {
    route.params.pipe(
      switchMap(param => {
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
}
