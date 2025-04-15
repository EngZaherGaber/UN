import { Component } from '@angular/core';
import { APIResponse } from '../../../../general/interfaces/response';
import { ActivatedRoute, Router } from '@angular/router';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { ToastService } from '../../../../general/services/toast.service';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { switchMap } from 'rxjs';
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
  roles: { roleId: number, roleName: string }[] = [];
  constructor(
    roleSrv: RoleService,
    private userSrv: UserService,
    private msgSrv: ToastService,
    private router: Router,
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
  submit(event: any) {
    const body = {
      userId: this.userId,
      ...event
    }
    this.userSrv.edit(body, this.userId ?? 0).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.router.navigate(['admin/user']);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
