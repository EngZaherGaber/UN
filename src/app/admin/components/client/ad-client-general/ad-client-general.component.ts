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
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ClientAddComponent } from '../client-add/client-add.component';
import { ClientEditComponent } from '../client-edit/client-edit.component';
import { ClientDisplayComponent } from '../client-display/client-display.component';
import { Client } from '../../../../general/interfaces/client';

@Component({
  selector: 'ad-client-general',
  imports: [
    DynamicTableComponent,
    DialogModule,
    CommonModule,
    ClientAddComponent,
    ClientEditComponent,
    ClientDisplayComponent
  ],
  templateUrl: './ad-client-general.component.html',
  styleUrl: './ad-client-general.component.scss'
})
export class AdClientGeneralComponent {
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  addDialog: boolean = false;
  editDialog: boolean = false;
  displayDialog: boolean = false;
  editClientId: number = 0;
  displayClientId: number = 0;

  addFunc: () => void = () => {
    this.addDialog = true;
  }
  editFunc: (rowData: Client) => void = (rowData: Client) => {
    this.editClientId = rowData.clientId;
    this.editDialog = true;
  }
  displayFunc: (rowData: Client) => void = (rowData: Client) => {
    this.displayClientId = rowData.clientId;
    this.displayDialog = true;
  }
  deleteFunc: (rowData: any) => void = (rowData) => {
    this.confirm.deleteConfirm((obj) => {
      this.clntSrv.delete(obj).subscribe(res => {
        this.msgSrv.showSuccess('Success!', 'Client Deleted');
        this.info.getSub$.next({})
      });
    }, rowData.clientId)
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
              ],
            });
          }
        })
      );
    this.info.getSub$.next(true)
  }
}
