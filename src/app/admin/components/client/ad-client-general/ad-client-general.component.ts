import { Component } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Router } from '@angular/router';
import { switchMap, catchError, of } from 'rxjs';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ToastService } from '../../../../general/services/toast.service';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';

@Component({
  selector: 'app-ad-client-general',
  imports: [AdTemplateComponent,
    DynamicTableComponent,],
  templateUrl: './ad-client-general.component.html',
  styleUrl: './ad-client-general.component.scss'
})
export class AdClientGeneralComponent {
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  showResetDialog: boolean = false;
  addFunc: () => void = () => {
    this.router.navigate(['admin/client/add'])
  }
  deleteFunc: (rowData: any) => void = (rowData) => {
    this.confirm.deleteConfirm((obj) => {
      this.clntSrv.delete(obj).subscribe(res => {
        this.msgSrv.showWarn('Success!', 'Client Deleted');
        this.info.getSub$.next({})
      });
    }, rowData.clientId)
  }
  editFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/client/edit/' + rowData.clientId])
  }
  displayFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/client/display/' + rowData.clientId])
  }


  constructor(
    private msgSrv: ToastService,
    tblSrv: DyTableService,
    private router: Router,
    private clntSrv: ClientService,
    private confirm: ConfirmService,
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.editFunc, this.displayFunc, this.addFunc);

  }
  ngOnInit(): void {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.clntSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: [
                    {
                      field: 'clientName',
                      header: 'clientName',
                      HeaderType: 'string',
                    },
                  ],
                  loading: false,
                  count: res.count
                })
              }),
              catchError(err => {
                return of({
                  loading: false,
                  data: [],
                  columns: [
                    {
                      field: 'clientName',
                      header: 'clientName',
                      HeaderType: 'string',
                    },
                  ],
                });
              }),

            )
          } else {
            return of({
              loading: false,
              data: [],
              columns: [
                {
                  field: 'clientName',
                  header: 'clientName',
                  HeaderType: 'string',
                },
                {
                  field: 'roleName',
                  header: 'roleName',
                  HeaderType: 'string',
                },
              ],
            });
          }
        })
      );
    this.info.getSub$.next(true)
  }
}
