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
  userId?: number;
  roles: { roleId: number, roleName: string }[] = [];
  constructor(
    roleSrv: RoleService,
    userSrv: UserService,
    route: ActivatedRoute) {
    route.params.pipe(
      switchMap(param => {
        this.userId = +param['id'];
        return roleSrv.getAll();
      })
    )
      .pipe(
        switchMap(param => {
          this.roles = param['data']
          return userSrv.getById(this.userId ?? 0);
        })
      )
      .subscribe(res => {
        this.objs = {
          general: [
            {
              key: 'userName',
              label: 'Username',
              value: res.data.userName,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'roleId',
              label: 'Role',
              value: res.data.roleId,
              dataType: 'list',
              options: (this.roles).map(role => {
                return { id: role.roleId, name: role.roleName }
              }),
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'email',
              label: 'Email',
              value: res.data.email,
              dataType: 'email',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
          ],
        };
      })
  }
}
