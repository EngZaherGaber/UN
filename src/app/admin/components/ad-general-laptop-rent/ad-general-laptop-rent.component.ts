import { Component } from '@angular/core';
import { LaptopType } from '../../../general/interfaces/laptop-type';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { switchMap, of, catchError } from 'rxjs';
import { DynamicTableComponent } from '../../../general/components/dynamic-table/dynamic-table.component';
import { DynmaicFormComponent } from '../../../general/components/dynmaic-form/dynmaic-form.component';
import { InfoTable } from '../../../general/interfaces/info-table';
import { InputDynamic } from '../../../general/interfaces/input-dynamic';
import { ConfirmService } from '../../../general/services/confirm.service';
import { DyTableService } from '../../../general/services/dy-table.service';
import { ToastService } from '../../../general/services/toast.service';
import { LaptopTypeService } from '../../services/laptop-type.service';
import { LaptopRentService } from '../../services/laptop-rent.service';

@Component({
  selector: 'ad-general-laptop-rent',
  imports: [DynamicTableComponent, DynmaicFormComponent, DialogModule, CommonModule],
  templateUrl: './ad-general-laptop-rent.component.html',
  styleUrl: './ad-general-laptop-rent.component.scss'
})
export class AdGeneralLaptopRentComponent {
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  laptopTypes: LaptopType[] = [];
  editLaptopTypeId: number = 0;
  addDialog: boolean = false;
  displayDialog: boolean = false;
  editDialog: boolean = false;
  addFunc: () => void = () => {
    this.resetObjs = {
      general: [
        {
          key: 'laptopType',
          label: 'Laptop Type',
          value: null,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.laptopTypes,
        },
        {
          key: 'year',
          label: 'Year',
          value: null,
          dataType: 'year',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'month',
          label: 'Month',
          value: null,
          dataType: 'month',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'price',
          label: 'price',
          value: null,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },

      ],
    };
    this.addDialog = true;
  }

  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private laptopTypeSrv: LaptopTypeService,
    private laptopRentSrv: LaptopRentService,
    private confirm: ConfirmService
  ) {
    this.info = tblSrv.getStandardInfo(undefined, undefined, undefined, this.addFunc);
    this.laptopTypeSrv.getAll().subscribe(res => {
      this.laptopTypes = res.data;
    })
  }

  ngOnInit() {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.laptopRentSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: [
                    {
                      field: 'year',
                      header: 'year',
                      HeaderType: 'int',
                    },
                    {
                      field: 'month',
                      header: 'month',
                      HeaderType: 'int',
                    },
                    {
                      field: 'price',
                      header: 'price',
                      HeaderType: 'int',
                    },
                    {
                      field: 'laptopTypeName',
                      header: 'laptopTypeName',
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
                      field: 'name',
                      header: 'Name',
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
                  field: 'name',
                  header: 'Name',
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
    this.laptopRentSrv.add(event).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.addDialog = false;
        this.info.getSub$.next(true);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }

    })
  }

}
