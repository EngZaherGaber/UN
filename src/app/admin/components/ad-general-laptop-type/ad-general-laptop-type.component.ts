import { Component } from '@angular/core';
import { LaptopType } from '../../../general/interfaces/laptop-type';
import { LaptopTypeService } from '../../services/laptop-type.service';
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

@Component({
  selector: 'ad-general-laptop-type',
  imports: [DynamicTableComponent, DynmaicFormComponent, DialogModule, CommonModule],
  templateUrl: './ad-general-laptop-type.component.html',
  styleUrl: './ad-general-laptop-type.component.scss'
})
export class AdGeneralLaptopTypeComponent {
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  editLaptopTypeId: number = 0;
  addDialog: boolean = false;
  displayDialog: boolean = false;
  editDialog: boolean = false;
  addFunc: () => void = () => {
    this.resetObjs = {
      general: [
        {
          key: 'name',
          label: 'Name',
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
  editFunc: (rowData: LaptopType) => void = (rowData: LaptopType) => {
    this.editLaptopTypeId = rowData.id;
    this.resetObjs = {
      general: [
        {
          key: 'name',
          label: 'Name',
          value: rowData.name,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'id',
          label: 'English Name',
          value: rowData.id,
          dataType: 'int',
          required: true,
          visible: false,
          options: [],
        },

      ],
    };
    this.editDialog = true;
  }
  displayFunc: (rowData: LaptopType) => void = (rowData: LaptopType) => {
    this.resetObjs = {
      general: [
        {
          key: 'name',
          label: 'Name',
          value: rowData.name,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'id',
          label: 'English Name',
          value: rowData.id,
          dataType: 'int',
          required: true,
          visible: false,
          options: [],
        },

      ],
    };
    this.displayDialog = true;
  }
  deleteFunc: (rowData: LaptopType) => void = (rowData: LaptopType) => {
    this.confirm.deleteConfirm((obj) => {
      this.laptopTypeSrv.delete(obj).subscribe(res => {
        this.msgSrv.showSuccess('Success!', 'Laptop Type Deleted');
        this.info.getSub$.next(true)
      });
    }, rowData.id)
  }
  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private laptopTypeSrv: LaptopTypeService,
    private confirm: ConfirmService
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.editFunc, this.displayFunc, this.addFunc);
  }

  ngOnInit() {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.laptopTypeSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: [
                    {
                      field: 'name',
                      header: 'Name',
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
    this.laptopTypeSrv.add(event).subscribe(res => {
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
    this.laptopTypeSrv.edit(event, this.editLaptopTypeId).subscribe(res => {
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
