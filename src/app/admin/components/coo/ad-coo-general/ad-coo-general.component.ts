import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, of, catchError } from 'rxjs';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ToastService } from '../../../../general/services/toast.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { CooService } from '../../../services/coo.service';
import { COO } from '../../../../general/interfaces/coo';

@Component({
  selector: 'ad-coo-general',
  imports: [AdTemplateComponent, DynamicTableComponent],
  templateUrl: './ad-coo-general.component.html',
  styleUrl: './ad-coo-general.component.scss'
})
export class AdCooGeneralComponent {
  info: InfoTable;
  addFunc: () => void = () => {
    this.router.navigate(['admin/coo/add'])
  }
  deleteFunc: (rowData: COO) => void = (rowData) => {
    this.confirm.deleteConfirm((obj) => {
      this.cooSrv.delete(obj).subscribe(res => {
        this.msgSrv.showSuccess('Success!', 'COO Deleted');
        this.info.getSub$.next(true)
      });
    }, rowData.cooId)
  }
  editFunc: (rowData: COO) => void = (rowData) => {
    this.router.navigate(['admin/coo/edit/' + rowData.cooId])
  }
  displayFunc: (rowData: COO) => void = (rowData) => {
    this.router.navigate(['admin/coo/display/' + rowData.cooId])
  }

  constructor(
    private msgSrv: ToastService,
    private tblSrv: DyTableService,
    private router: Router,
    private cooSrv: CooService,
    private confirm: ConfirmService
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.editFunc, this.displayFunc, this.addFunc)
  }
  ngOnInit(): void {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.cooSrv.getAll(body).pipe(
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: [
                    {
                      field: 'cooNumber',
                      header: 'cooNumber',
                      HeaderType: 'Toggle',
                    },
                    {
                      field: 'cooDate',
                      header: 'cooDate',
                      HeaderType: 'string',
                    },
                    {
                      field: 'clientName',
                      header: 'clientName',
                      HeaderType: 'string',
                    },
                    {
                      field: 'currencyType',
                      header: 'currencyType',
                      HeaderType: 'string',
                    },
                    {
                      field: 'poNumber',
                      header: 'poNumber',
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
                      field: 'cooNumber',
                      header: 'cooNumber',
                      HeaderType: 'Toggle',
                    },
                    {
                      field: 'cooDate',
                      header: 'cooDate',
                      HeaderType: 'string',
                    },
                    {
                      field: 'clientName',
                      header: 'clientName',
                      HeaderType: 'string',
                    },
                    {
                      field: 'currencyType',
                      header: 'currencyType',
                      HeaderType: 'string',
                    },
                    {
                      field: 'poNumber',
                      header: 'poNumber',
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
                  field: 'cooNumber',
                  header: 'cooNumber',
                  HeaderType: 'Toggle',
                },
                {
                  field: 'cooDate',
                  header: 'cooDate',
                  HeaderType: 'string',
                },
                {
                  field: 'clientName',
                  header: 'clientName',
                  HeaderType: 'string',
                },
                {
                  field: 'currencyType',
                  header: 'currencyType',
                  HeaderType: 'string',
                },
                {
                  field: 'poNumber',
                  header: 'poNumber',
                  HeaderType: 'string',
                },

              ],
            });
          }
        })
      );
  }
}
