import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { switchMap, of, catchError } from 'rxjs';
import { DynamicTableComponent } from '../../../general/components/dynamic-table/dynamic-table.component';
import { DynmaicFormComponent } from '../../../general/components/dynmaic-form/dynmaic-form.component';
import { InfoTable } from '../../../general/interfaces/info-table';
import { InputDynamic } from '../../../general/interfaces/input-dynamic';
import { DyTableService } from '../../../general/services/dy-table.service';
import { ToastService } from '../../../general/services/toast.service';
import { CityService } from '../../services/city.service';
import { City } from '../../../general/interfaces/city';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../../general/services/confirm.service';

@Component({
  selector: 'ad-general-city',
  imports: [DynamicTableComponent, DynmaicFormComponent, DialogModule, CommonModule],
  templateUrl: './ad-general-city.component.html',
  styleUrl: './ad-general-city.component.scss'
})
export class AdGeneralCityComponent {
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  editCityId: number = 0;
  addDialog: boolean = false;
  displayDialog: boolean = false;
  editDialog: boolean = false;
  addFunc: () => void = () => {
    this.resetObjs = {
      general: [
        {
          key: 'nameAr',
          label: 'Arabic Name',
          value: null,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'nameEn',
          label: 'English Name',
          value: null,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
      ],
    };
    this.addDialog = true;
  }
  editFunc: (rowData: City) => void = (rowData: City) => {
    this.editCityId = rowData.cityId;
    this.resetObjs = {
      general: [
        {
          key: 'nameAr',
          label: 'Arabic Name',
          value: rowData.nameAr,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'cityId',
          label: 'English Name',
          value: rowData.cityId,
          dataType: 'int',
          required: true,
          visible: false,
          options: [],
        },
        {
          key: 'nameEn',
          label: 'English Name',
          value: rowData.nameEn,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
      ],
    };
    this.editDialog = true;
  }
  displayFunc: (rowData: City) => void = (rowData: City) => {
    this.resetObjs = {
      general: [
        {
          key: 'nameAr',
          label: 'Arabic Name',
          value: rowData.nameAr,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'cityId',
          label: 'English Name',
          value: rowData.cityId,
          dataType: 'int',
          required: true,
          visible: false,
          options: [],
        },
        {
          key: 'nameEn',
          label: 'English Name',
          value: rowData.nameEn,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
      ],
    };
    this.displayDialog = true;
  }
  deleteFunc: (rowData: City) => void = (rowData: City) => {
    this.confirm.deleteConfirm((obj) => {
      this.citySrv.delete(obj).subscribe(res => {
        this.msgSrv.showSuccess('Success!', 'City Deleted');
        this.info.getSub$.next(true)
      });
    }, rowData.cityId)
  }
  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private citySrv: CityService,
    private confirm: ConfirmService
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.editFunc, this.displayFunc, this.addFunc);
  }

  ngOnInit() {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.citySrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: [
                    {
                      field: 'nameEn',
                      header: 'English Name',
                      HeaderType: 'string',
                    },
                    {
                      field: 'nameAr',
                      header: 'Arabic Name',
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
                      field: 'nameEn',
                      header: 'English Name',
                      HeaderType: 'string',
                    },
                    {
                      field: 'nameAr',
                      header: 'Arabic Name',
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
                  field: 'nameEn',
                  header: 'English Name',
                  HeaderType: 'string',
                },
                {
                  field: 'nameAr',
                  header: 'Arabic Name',
                  HeaderType: 'string',
                },
              ],
            });
          }
        })
      );
    this.info.getSub$.next(true)
  }

  add(event: any) {
    this.citySrv.add(event).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.addDialog = false;
        this.info.getSub$.next(true);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }

    })
  }
  edit(event: any) {
    this.citySrv.edit(event, this.editCityId).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.editDialog = false;
        this.info.getSub$.next(true);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
