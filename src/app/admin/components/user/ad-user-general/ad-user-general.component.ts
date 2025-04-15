import { Component } from '@angular/core';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { catchError, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ToastService } from '../../../../general/services/toast.service';
import { UserService } from '../../../services/user.service';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'ad-user-general',
  imports: [
    AdTemplateComponent,
    DynamicTableComponent,
    DialogModule,
    DynmaicFormComponent
  ],
  templateUrl: './ad-user-general.component.html',
  styleUrl: './ad-user-general.component.scss'
})
export class AdUserGeneralComponent {
  // deleteFunc: (rowData: any) => void = (rowData) => {
  //   this.confirm.deleteConfirm((obj) => {
  //     this.usrSrv.delete(obj).subscribe(res => {
  //       this.msgSrv.showSuccess('Success!', 'User Deleted');
  //       this.info.getSub$.next({})
  //     });
  //   }, rowData.userId)
  // }
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  showResetDialog: boolean = false;
  addFunc: () => void = () => {
    this.router.navigate(['admin/user/add'])
  }
  editFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/user/edit/' + rowData.userId])
  }
  displayFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/user/display/' + rowData.userId])
  }
  resetPasswordFunc: (rowData: any) => void = (rowData) => {
    this.resetObjs = {
      general: [
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
          value: rowData.userId,
          dataType: 'string',
          visible: false,
          options: [],
        },
      ],
    }
    this.showResetDialog = true;
  }

  constructor(
    private msgSrv: ToastService,
    tblSrv: DyTableService,
    private router: Router,
    private usrSrv: UserService,
  ) {
    this.info = tblSrv.getStandardInfo(undefined, this.editFunc, this.displayFunc, this.addFunc);
    this.info.Buttons.push({
      icon: 'pi pi-key',
      command: this.resetPasswordFunc,
      isShow: true,
      severity: 'primary',
      tooltip: 'change Password'
    })
  }
  ngOnInit(): void {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.usrSrv.getAll(body).pipe(
              catchError(err => {
                return of({
                  loading: false,
                  data: [],
                  columns: [
                    {
                      field: 'userName',
                      header: 'userName',
                      HeaderType: 'string',
                    },
                    {
                      field: 'roleName',
                      header: 'roleName',
                      HeaderType: 'string',
                    },
                    {
                      field: 'email',
                      header: 'email',
                      HeaderType: 'string',
                    },
                  ],
                });
              }),
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: [
                    {
                      field: 'userName',
                      header: 'userName',
                      HeaderType: 'string',
                    },
                    {
                      field: 'roleName',
                      header: 'roleName',
                      HeaderType: 'string',
                    },
                    {
                      field: 'email',
                      header: 'email',
                      HeaderType: 'string',
                    },
                  ],
                  loading: false,
                  count: res.count
                })
              })
            )
          } else {
            return of({
              loading: false,
              data: [],
              columns: [
                {
                  field: 'userName',
                  header: 'userName',
                  HeaderType: 'string',
                },
                {
                  field: 'roleName',
                  header: 'roleName',
                  HeaderType: 'string',
                },
                {
                  field: 'email',
                  header: 'email',
                  HeaderType: 'string',
                },
              ],
            });
          }
        })
      );
  }
  submit(event: any) {
    this.usrSrv.resetPassword(event).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
      this.showResetDialog = false;
    });
  }
}
