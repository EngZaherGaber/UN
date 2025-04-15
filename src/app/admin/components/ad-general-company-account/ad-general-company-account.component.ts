import { Component } from '@angular/core';
import { CopmanyAccount } from '../../../general/interfaces/company-account';
import { CompanyAccountService } from '../../services/company-account.service';
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
import { BankService } from '../../services/bank.service';
import { Bank } from '../../../general/interfaces/bank';

@Component({
  selector: 'ad-general-company-account',
  imports: [DynamicTableComponent, DynmaicFormComponent, DialogModule, CommonModule],
  templateUrl: './ad-general-company-account.component.html',
  styleUrl: './ad-general-company-account.component.scss'
})
export class AdGeneralCompanyAccountComponent {
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  editCompanyAccountId: number = 0;
  addDialog: boolean = false;
  displayDialog: boolean = false;
  editDialog: boolean = false;
  banks: Bank[] = [];
  columns = [
    {
      field: 'bankName',
      header: 'Bank Name',
      HeaderType: 'string',
    },
    {
      field: 'region',
      header: 'region',
      HeaderType: 'string',
    },
    {
      field: 'branch',
      header: 'branch',
      HeaderType: 'string',
    },
    {
      field: 'accountNumber',
      header: 'accountNumber',
      HeaderType: 'string',
    },
  ]
  addFunc: () => void = () => {
    this.resetObjs = {
      general: [
        {
          key: 'banksId',
          label: 'Bank',
          value: null,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.banks.map(x => {
            return { id: x.banksId, name: x.banksName }
          }),
        },
        {
          key: 'region',
          label: 'Region',
          value: null,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'branch',
          label: 'Branch',
          value: null,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'accountNumber',
          label: 'Account Number',
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
  editFunc: (rowData: CopmanyAccount) => void = (rowData: CopmanyAccount) => {
    this.editCompanyAccountId = rowData.accountCompanyId;
    this.resetObjs = {
      general: [
        {
          key: 'banksId',
          label: 'Bank',
          value: rowData.banksId,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.banks.map(x => {
            return { id: x.banksId, name: x.banksName }
          }),
        },
        {
          key: 'region',
          label: 'Region',
          value: rowData.region,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'branch',
          label: 'Branch',
          value: rowData.branch,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'accountNumber',
          label: 'Account Number',
          value: rowData.accountNumber,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
      ],
    };
    this.editDialog = true;
  }
  displayFunc: (rowData: CopmanyAccount) => void = (rowData: CopmanyAccount) => {
    this.resetObjs = {
      general: [
        {
          key: 'banksId',
          label: 'Bank',
          value: rowData.banksId,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.banks.map(x => {
            return { id: x.banksId, name: x.banksName }
          }),
        },
        {
          key: 'region',
          label: 'Region',
          value: rowData.region,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'branch',
          label: 'Branch',
          value: rowData.branch,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'accountNumber',
          label: 'Account Number',
          value: rowData.accountNumber,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
      ],
    };
    this.displayDialog = true;
  }
  deleteFunc: (rowData: CopmanyAccount) => void = (rowData: CopmanyAccount) => {
    this.confirm.deleteConfirm((obj) => {
      this.companyAccountSrv.delete(obj).subscribe(res => {
        this.msgSrv.showSuccess('Success!', 'Copmany Account Deleted');
        this.info.getSub$.next({})
      });
    }, rowData.accountCompanyId)
  }
  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private companyAccountSrv: CompanyAccountService,
    private confirm: ConfirmService,
    private bnkSrv: BankService
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.editFunc, this.displayFunc, this.addFunc);
    this.bnkSrv.getAll().subscribe(res => this.banks = res.data)
  }

  ngOnInit() {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.companyAccountSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: res.data,
                  columns: this.columns,
                  loading: false,
                  count: res.count
                })
              }),
              catchError(err => {
                return of({
                  loading: false,
                  data: [],
                  columns: this.columns,
                });
              }),

            )
          } else {
            return of({
              loading: false,
              data: [],
              columns: this.columns,
            });
          }
        })
      );
    this.info.getSub$.next(true)
  }

  add(event: any) {
    this.companyAccountSrv.add(event).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }

    })
    this.addDialog = false;
    this.info.getSub$.next(true);
  }
  edit(event: any) {
    this.companyAccountSrv.edit(event, this.editCompanyAccountId).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
    this.editDialog = false;
    this.info.getSub$.next(true);
  }
}
