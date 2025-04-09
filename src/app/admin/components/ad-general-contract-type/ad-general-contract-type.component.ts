import { Component } from '@angular/core';
import { TypeOfContractService } from '../../services/type-of-contract.service';
import { switchMap, of, catchError } from 'rxjs';
import { InfoTable } from '../../../general/interfaces/info-table';
import { InputDynamic } from '../../../general/interfaces/input-dynamic';
import { DyTableService } from '../../../general/services/dy-table.service';
import { ToastService } from '../../../general/services/toast.service';
import { DialogModule } from 'primeng/dialog';
import { DynamicTableComponent } from '../../../general/components/dynamic-table/dynamic-table.component';
import { DynmaicFormComponent } from '../../../general/components/dynmaic-form/dynmaic-form.component';
import { TypeOfContract } from '../../../general/interfaces/type-of-contract';
import { ConfirmService } from '../../../general/services/confirm.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ad-general-contract-type',
  imports: [DynamicTableComponent, DynmaicFormComponent, DialogModule, CommonModule],
  templateUrl: './ad-general-contract-type.component.html',
  styleUrl: './ad-general-contract-type.component.scss'
})
export class AdGeneralContractTypeComponent {
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  editTypeOfContractId: number = 0;
  addDialog: boolean = false;
  displayDialog: boolean = false;
  editDialog: boolean = false;
  addFunc: () => void = () => {
    this.resetObjs = {
      general: [
        {
          key: 'nmaeEn',
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
  editFunc: (rowData: TypeOfContract) => void = (rowData: TypeOfContract) => {
    this.editTypeOfContractId = rowData.typeOfContractId;
    this.resetObjs = {
      general: [
        {
          key: 'nmaeEn',
          label: 'English Name',
          value: rowData.nmaeEn,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'typeOfContractId',
          label: 'English Name',
          value: rowData.typeOfContractId,
          dataType: 'int',
          required: true,
          visible: false,
          options: [],
        },
      ],
    };
    this.editDialog = true;
  }
  displayFunc: (rowData: TypeOfContract) => void = (rowData: TypeOfContract) => {
    this.resetObjs = {
      general: [
        {
          key: 'nmaeEn',
          label: 'English Name',
          value: rowData.nmaeEn,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'typeOfContractId',
          label: 'English Name',
          value: rowData.typeOfContractId,
          dataType: 'int',
          required: true,
          visible: false,
          options: [],
        },
      ],
    };
    this.displayDialog = true;
  }
  deleteFunc: (rowData: TypeOfContract) => void = (rowData: TypeOfContract) => {
    this.confirm.deleteConfirm((obj) => {
      this.typeOfContractSrv.delete(obj).subscribe(res => {
        this.msgSrv.showSuccess('Success!', 'Type Of Contract Deleted');
        this.info.getSub$.next({})
      });
    }, rowData.typeOfContractId)
  }
  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private typeOfContractSrv: TypeOfContractService,
    private confirm: ConfirmService
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.editFunc, this.displayFunc, this.addFunc);
  }

  ngOnInit() {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.typeOfContractSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: [
                    {
                      field: 'nmaeEn',
                      header: 'English Name',
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
                      field: 'nmaeEn',
                      header: 'English Name',
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
                  field: 'nmaeEn',
                  header: 'English Name',
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
    this.typeOfContractSrv.add(event).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
      this.info.getSub$.next(true);
      this.addDialog = false;
    })
  }
  edit(event: any) {
    this.typeOfContractSrv.edit(event, this.editTypeOfContractId).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
      this.info.getSub$.next(true);
      this.editDialog = false;
    })
  }
}
