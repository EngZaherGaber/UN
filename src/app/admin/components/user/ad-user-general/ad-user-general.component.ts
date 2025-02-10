import { Component } from '@angular/core';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { ReplaySubject, Observable, of, switchMap } from 'rxjs';
import { DyButton } from '../../../../general/interfaces/dy-button';
import { Router } from '@angular/router';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ToastService } from '../../../../general/services/toast.service';
import { UserService } from '../../../services/user.service';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { InfoTable } from '../../../../general/interfaces/info-table';

@Component({
  selector: 'ad-user-general',
  imports: [AdTemplateComponent, DynamicTableComponent],
  templateUrl: './ad-user-general.component.html',
  styleUrl: './ad-user-general.component.scss'
})
export class AdUserGeneralComponent {
  info: InfoTable;
  addFunc: () => void = () => {
    this.router.navigate(['admin/user/add'])
  }
  deleteFunc: (rowData: any) => void = (rowData) => {
    this.confirm.deleteConfirm((obj) => {
      this.usrSrv.delete(obj).subscribe(res => {
        this.msgSrv.showWarn('Success!', 'User Deleted');
        this.info.getSub$.next(true)
      });
    }, rowData.userId)
  }
  
  constructor(
    private msgSrv: ToastService,
    private tblSrv: DyTableService,
    private router: Router,
    private usrSrv: UserService,
    private confirm: ConfirmService
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, undefined, undefined, this.addFunc)
  }
  ngOnInit(): void {
    this.info.get$ = this.tblSrv.getLibObs(
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body === true) {
            return this.usrSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: {
                    model: res.data,
                    type: [
                      {
                        attribute: 'userName',
                        dynamic: null,
                        dataType: 'string',
                      },
                      {
                        attribute: 'roleName',
                        dynamic: null,
                        dataType: 'int',
                      },
                    ],
                  },
                });
              })
            )
          } else {
            return of({
              loading: false,
              data: [],
              columns: [],
            });
          }
        })
      ),
      ['Id', 'Deleted'],
      ['isStudent']
    );
    this.info.getSub$.next(true);
  }
}
