import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, of, catchError } from 'rxjs';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ToastService } from '../../../../general/services/toast.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { BankService } from '../../../services/bank.service';
import { BankAddComponent } from '../bank-add/bank-add.component';
import { BankEditComponent } from '../bank-edit/bank-edit.component';
import { BankDisplayComponent } from '../bank-display/bank-display.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Bank } from '../../../../general/interfaces/bank';

@Component({
  selector: 'ad-bank-general',
  imports: [
    DynamicTableComponent,
    BankAddComponent,
    BankEditComponent,
    BankDisplayComponent,
    DialogModule,
    CommonModule
  ],
  templateUrl: './ad-bank-general.component.html',
  styleUrl: './ad-bank-general.component.scss'
})
export class AdBankGeneralComponent {
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};  addDialog: boolean = false;
  editDialog: boolean = false;
  displayDialog: boolean = false;
  editBankId: number = 0;
  displayBankId: number = 0;
  addFunc: () => void = () => {
    this.addDialog = true;
  }
  editFunc: (rowData: Bank) => void = (rowData: Bank) => {
    this.editBankId = rowData.banksId;
    this.editDialog = true;
  }
  displayFunc: (rowData: Bank) => void = (rowData: Bank) => {
    this.displayDialog = true;
    this.displayBankId = rowData.banksId;
  }
  deleteFunc: (rowData: Bank) => void = (rowData: Bank) => {
    this.confirm.deleteConfirm((obj) => {
      this.bnkSrv.delete(obj).subscribe(res => {
        this.msgSrv.showSuccess('Success!', 'Bank Deleted');
        this.info.getSub$.next(true)
      });
    }, rowData.banksId)
  }
  constructor(
    tblSrv: DyTableService,
    private bnkSrv: BankService,
    private msgSrv: ToastService,
    private confirm: ConfirmService,
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.editFunc, this.displayFunc, this.addFunc);
  }
  
  ngOnInit(): void {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.bnkSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: [
                    {
                      field: 'banksName',
                      header: 'banksName',
                      HeaderType: 'string',
                    },
                    {
                      field: 'bankLogoUrl',
                      header: 'bankLogoUrl',
                      HeaderType: 'img',
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
                      field: 'banksName',
                      header: 'banksName',
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
                  field: 'banksName',
                  header: 'banksName',
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
