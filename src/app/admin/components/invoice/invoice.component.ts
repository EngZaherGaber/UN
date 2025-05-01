import { ChangeDetectorRef, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AdTemplateComponent } from '../ad-template/ad-template.component';
import { DynamicTableComponent } from '../../../general/components/dynamic-table/dynamic-table.component';
import { Router } from '@angular/router';
import { DyTableService } from '../../../general/services/dy-table.service';
import { EmployeeService } from '../../services/employee.service';
import { InfoTable } from '../../../general/interfaces/info-table';
import { switchMap, of, catchError, map, forkJoin } from 'rxjs';
import { ToolbarModule } from 'primeng/toolbar';
import { InputDynamic } from '../../../general/interfaces/input-dynamic';
import { FormControl, FormGroup } from '@angular/forms';
import { ContractService } from '../../services/contract.service';
import { CommonModule } from '@angular/common';

import { InvoiceService } from '../../services/invoice.service';
import { CompanyAccountService } from '../../services/company-account.service';
import { DynmaicFormComponent } from '../../../general/components/dynmaic-form/dynmaic-form.component';
import { InvoiceTemplateComponent } from '../../../general/components/invoice-template/invoice-template.component';
import { ClientService } from '../../services/client.service';
import { BankService } from '../../services/bank.service';
import { InvoiceItem } from '../../../general/interfaces/invoice-item';

@Component({
  selector: 'app-invoice',
  imports: [
    ButtonModule,
    AdTemplateComponent,
    DynamicTableComponent,
    ToolbarModule,
    InvoiceTemplateComponent,
    DynmaicFormComponent,
    CommonModule
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {
  info: InfoTable;
  objs: { [key: string]: InputDynamic[] } | null = null;
  columns = [
    {
      field: 'arabicName',
      header: 'Name in Arabic',
      HeaderType: 'string',
    },
    {
      field: 'empName',
      header: 'Name in Laiten',
      HeaderType: 'string',
    },
    {
      field: 'salaryUsd',
      header: 'Salary (USD)',
      HeaderType: 'int',
    },
    {
      field: 'payableSalaryUsd',
      header: 'Payable Salary (USD)',
      HeaderType: 'int',
    },
    {
      field: 'payableSalarySYP',
      header: 'Payable Salary (SYP)',
      HeaderType: 'int',
    },
    {
      field: 'transportion',
      header: 'transportion',
      HeaderType: 'int',
    },
    {
      field: 'mobile',
      header: 'mobile',
      HeaderType: 'int',
    },
    {
      field: 'laptop',
      header: 'laptop',
      HeaderType: 'int',
    },
    {
      field: 'total',
      header: 'total',
      HeaderType: 'int',
    },
    {
      field: 'po',
      header: 'PO',
      HeaderType: 'string',
    },

  ];
  employeeArray: any[] = [];
  selectedPO?: string;
  invoice?: InvoiceItem;
  constructor(
    tblSrv: DyTableService,
    private router: Router,
    private clientSrv: ClientService,
    private contractSrv: ContractService,
    private bnkSrv: BankService,
    private invoiceSrv: InvoiceService,
    private companyAccount: CompanyAccountService,
    private cd: ChangeDetectorRef
  ) {
    this.info = tblSrv.getStandardInfo(undefined, undefined, undefined, undefined);
    forkJoin({
      po: contractSrv.getAllPoNumber(),
      accounts: companyAccount.getAll(),
      clients: clientSrv.getAll(),
      banks: bnkSrv.getAll()
    }).subscribe(res => {
      this.objs = {
        general: [
          {
            key: 'poNumber',
            label: 'PO Number',
            dataType: 'autoComplete',
            value: null,
            required: true,
            options: this.returnPoNumberList(res.po.data),
            visible: true,
            command: (value, element, form) => {
              this.selectedPO = value;
              this.info.getSub$.next({ poNumber: this.selectedPO, month: new Date().getMonth() + 1, year: new Date().getFullYear() })
            }
          },
          {
            key: 'accountNo',
            label: 'Account',
            dataType: 'list',
            value: null,
            required: true,
            options: res.accounts.data.map(x => {
              return { id: x.accountNumber, name: x.accountNumber }
            }),
            visible: true
          },
          {
            key: 'bank',
            label: 'Bank Name',
            dataType: 'list',
            value: null,
            required: true,
            options: res.banks.data.map(x => {
              return { id: x.banksName, name: x.banksName }
            }),
            visible: true
          },
          {
            key: 'branch',
            label: 'Branch',
            dataType: 'string',
            value: null,
            required: true,
            options: [],
            visible: true
          },
          {
            key: 'client',
            label: 'Client',
            dataType: 'list',
            value: null,
            required: true,
            options: res.clients.data.map(x => {
              return { id: x.clientName, name: x.clientName }
            }),
            visible: true
          },
          {
            key: 'InvoiceNo',
            label: 'Invoice No',
            dataType: 'string',
            value: null,
            required: true,
            options: [],
            visible: true
          },
          {
            key: 'subject',
            label: 'Subject',
            dataType: 'string',
            value: null,
            required: true,
            options: [],
            visible: true
          },
        ]
      }
    })
  }
  ngOnInit(): void {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: { poNumber: string, year: number, month: number }) => {
          if (body) {
            return this.invoiceSrv.getAllDetails(body).pipe(
              switchMap(res => {
                this.employeeArray = [];
                res.data[0].coos.forEach(coo => {
                  coo.employess.forEach(employee => {
                    this.employeeArray.push({
                      empName: employee.empName,
                      arabicName: employee.arabicName,
                      salaryUsd: employee.salaryUsd,
                      payableSalaryUsd: employee.payableSalaryUsd,
                      payableSalarySYP: employee.payableSalarySYP,
                      transportion: employee.transportion,
                      mobile: employee.mobile,
                      laptop: employee.laptop,
                      cooNumber: coo.cooNumber,
                      cooDate: coo.cooDate,
                      total: employee.payableSalarySYP + employee.transportion + employee.mobile + employee.laptop,
                      po: body.poNumber
                    })
                  })
                })
                return of({
                  data: this.employeeArray,
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
  }
  returnPoNumberList(data: { poNumber: string }[]) {
    console.log(data.length)
    const uniquePoNumbers = new Set<string>();
    return data
      .filter(x => x.poNumber !== null && x.poNumber.toLowerCase() !== 'na' && x.poNumber !== '')
      .filter(x => {
        const isUnique = !uniquePoNumbers.has(x.poNumber);
        if (isUnique) {
          uniquePoNumbers.add(x.poNumber);
        }
        return isUnique;
      })
      .sort((a, b) => a.poNumber.localeCompare(b.poNumber))
      .map(x => {
        return { id: x.poNumber, name: x.poNumber };
      });
  }
  generate(event: any) {
    const total = this.employeeArray.map(x => x.payableSalarySYP).reduce((a, b) => a + b);
    this.invoice = {
      cooDate: this.employeeArray[0].cooDate,
      CooNo: this.employeeArray[0].cooNumber,
      employeeArray: this.employeeArray,
      InvoiceNo: event.InvoiceNo,
      client: event.client,
      poNumber: event.poNumber,
      accountNo: event.accountNo,
      branch: event.branch,
      bank: event.bank,
      subject: event.subject,
      total: total,
      mobile: this.employeeArray.map(x => x.mobile).reduce((a, b) => a + b),
      fees: 0.1 * total,
    }
  }

}
