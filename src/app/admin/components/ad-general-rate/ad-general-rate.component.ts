import { Component } from '@angular/core';
import { switchMap, of, catchError } from 'rxjs';
import { InfoTable } from '../../../general/interfaces/info-table';
import { InputDynamic } from '../../../general/interfaces/input-dynamic';
import { DyTableService } from '../../../general/services/dy-table.service';
import { ToastService } from '../../../general/services/toast.service';
import { RateService } from '../../services/rate.service';
import { DynamicTableComponent } from '../../../general/components/dynamic-table/dynamic-table.component';
import { DynmaicFormComponent } from '../../../general/components/dynmaic-form/dynmaic-form.component';
import { DialogModule } from 'primeng/dialog';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ad-general-rate',
  imports: [DynamicTableComponent, DynmaicFormComponent, DialogModule, CommonModule],
  templateUrl: './ad-general-rate.component.html',
  styleUrl: './ad-general-rate.component.scss'
})
export class AdGeneralRateComponent {
  info: InfoTable;
  clients: { id: number, name: string }[] = [];
  resetObjs: { [key: string]: InputDynamic[] } = {};
  addDialog: boolean = false;
  disableAtt: { [key: string]: string[] } = {
    general: ['yearNum', 'monthNum']
  };
  returnIfDiable: { [key: string]: string[] } = {
    general: ['yearNum', 'monthNum']
  };
  addFunc: () => void = () => {
    this.resetObjs = {
      general: [
        {
          key: 'yearNum',
          label: 'Year',
          value: new Date(),
          dataType: 'year',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'monthNum',
          label: 'Month',
          value: new Date(),
          dataType: 'month',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'clientId',
          label: 'Client Name',
          value: null,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.clients,
        },
        {
          key: 'exchangeRate',
          label: 'Exchange Rate',
          value: null,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },

      ],
    }
    this.addDialog = true;
  }
  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private rateSrv: RateService,
    private clientSrv: ClientService
  ) {
    clientSrv.getAll().subscribe(x => {
      this.clients = x.data.map(z => {
        return {
          id: z.clientId,
          name: z.clientName
        }
      })
    })
    this.info = tblSrv.getStandardInfo(undefined, undefined, undefined, this.addFunc);
  }

  ngOnInit() {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.rateSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: [
                    {
                      field: 'yearNum',
                      header: 'year',
                      HeaderType: 'int',
                    },
                    {
                      field: 'monthNum',
                      header: 'Month',
                      HeaderType: 'int',
                    },
                    {
                      field: 'exchangeRate',
                      header: 'exchangeRate',
                      HeaderType: 'int',
                    },
                    {
                      field: 'createdAt',
                      header: 'createdAt',
                      HeaderType: 'DateTimeO',
                    },
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
                      field: 'yearNum',
                      header: 'year',
                      HeaderType: 'int',
                    },
                    {
                      field: 'monthNum',
                      header: 'Month',
                      HeaderType: 'int',
                    },
                    {
                      field: 'exchangeRate',
                      header: 'exchangeRate',
                      HeaderType: 'int',
                    },
                    {
                      field: 'createdAt',
                      header: 'createdAt',
                      HeaderType: 'DateTimeO',
                    },
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
                  field: 'yearNum',
                  header: 'year',
                  HeaderType: 'int',
                },
                {
                  field: 'monthNum',
                  header: 'Month',
                  HeaderType: 'int',
                },
                {
                  field: 'exchangeRate',
                  header: 'exchangeRate',
                  HeaderType: 'int',
                },
                {
                  field: 'createdAt',
                  header: 'createdAt',
                  HeaderType: 'DateTimeO',
                },
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

  submit(event: any) {
    const body = {
      ...event,
      createdAt: new Date()
    }
    this.rateSrv.add(body).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
      this.info.getSub$.next(true)
      this.addDialog = false;
    })
  }
}
