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

@Component({
  selector: 'ad-general-rate',
  imports: [DynamicTableComponent, DynmaicFormComponent, DialogModule],
  templateUrl: './ad-general-rate.component.html',
  styleUrl: './ad-general-rate.component.scss'
})
export class AdGeneralRateComponent {
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  addDialog: boolean = false;
  addFunc: () => void = () => {
    this.resetObjs = {
      general: [
        {
          key: 'yearNum',
          label: 'Year',
          value: null,
          dataType: 'year',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'monthNum',
          label: 'Month',
          value: null,
          dataType: 'month',
          required: true,
          visible: true,
          options: [],
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
    private rateSrv: RateService
  ) {
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
