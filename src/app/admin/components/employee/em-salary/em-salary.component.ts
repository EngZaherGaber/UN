import { Component, Input } from '@angular/core';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { ToastService } from '../../../../general/services/toast.service';
import { switchMap, of, catchError, map, filter } from 'rxjs';
import { SalaryService } from '../../../services/salary.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { SalaryCreate } from '../../../../general/interfaces/salary-create';
import { PdfService } from '../../../../general/services/pdf.service';
import { CompanyAccountService } from '../../../services/company-account.service';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { ContractService } from '../../../services/contract.service';
import { Contract } from '../../../../general/interfaces/contract';
@Component({
  selector: 'em-salary',
  imports: [
    DynamicTableComponent,
    AdTemplateComponent,
    DialogModule,
    DynmaicFormComponent,
    CommonModule,
  ],
  templateUrl: './em-salary.component.html',
  styleUrl: './em-salary.component.scss'
})
export class EmSalaryComponent {
  @Input() emp: { id: number, name: string } = { id: 0, name: '' };
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  columns = [
    {
      field: 'cooNumber',
      header: 'cooNumber',
      HeaderType: 'string',
    },
    {
      field: 'poNumber',
      header: 'poNumber',
      HeaderType: 'string',
    },
    {
      field: 'employeeName',
      header: 'English Name',
      HeaderType: 'string',
    },
    {
      field: 'arabicName',
      header: 'Arabic Name',
      HeaderType: 'string',
    },
    {
      field: 'basicSalaryinUSD',
      header: 'Salary (USD)',
      HeaderType: 'int',
    },
    {
      field: 'totalSalaryCalculatedinSyrianPounds',
      header: 'Calculated Salary',
      HeaderType: 'int',
    },
    {
      field: 'slaryMonth',
      header: 'slaryMonth',
      HeaderType: 'int',
    },
    {
      field: 'slaryYear',
      header: 'slaryYear',
      HeaderType: 'int',
    },

  ];
  calcDialog: boolean = false;
  contracts: Contract[] = [];
  disableAtt: { [key: string]: string[] } = {
    general: [
      'year',
      'contractId'
    ],
  };
  calcFunc: () => void = () => {
    this.resetObjs = {
      general: [
        {
          key: 'employeeId',
          label: 'employee',
          value: +this.emp.id,
          dataType: 'int',
          required: true,
          visible: false,
          options: [],
        },
        {
          key: 'sickLeave',
          label: 'Sick Leave',
          value: null,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'daysOff',
          label: 'Days Off',
          value: null,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'downPayment',
          label: 'Down Payment',
          value: null,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'overTimeWages',
          label: 'Overtime Wages',
          value: null,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'month',
          label: 'month',
          value: null,
          dataType: 'month',
          required: true,
          visible: true,
          options: [],
          command: (value, element, form) => {
            const control = form?.get('general.year');
            if (value && value !== 0) {
              control?.enable();
            } else {
              control?.disable();
            }
          }
        },
        {
          key: 'year',
          label: 'year',
          value: null,
          dataType: 'year',
          required: true,
          visible: true,
          options: [],
          command: (value, element, form, objs) => {
            if (value && value !== 0) {
              const monthFrm = form?.get('general.month')
              let inpt: InputDynamic | undefined = (objs['general'] as InputDynamic[]).find(x => x.key === 'contractId');
              if (inpt) {
                inpt.options = this.filterContractsByMonth(value, monthFrm?.value);
                form?.get('general.contractId')?.setValue(inpt.options[0].id);
                form?.get('general.contractId')?.enable();
              }

            } else {
              form?.get('general.contractId')?.disable();
            }
          }
        },
        {
          key: 'contractId',
          label: 'Contract',
          value: null,
          dataType: 'list',
          required: true,
          visible: true,
          options: [],
        },
      ],
    };
    this.calcDialog = true;
  }
  billFunc: (rowData: any) => void = async (rowData: any) => {
    this.router.navigate(['/admin/employee/bill', this.emp.id, this.emp.name, rowData.salaryId])
  }
  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private router: Router,
    private salarySrv: SalaryService,
    private route: ActivatedRoute,
    private pdfSrv: PdfService,
    private companyAccountSrv: CompanyAccountService,
    private contractSrv: ContractService
  ) {
    this.info = tblSrv.getStandardInfo(undefined, undefined, undefined, this.calcFunc);
    this.info.captionButton.unshift({
      isShow: true,
      tooltip: 'Back',
      icon: 'pi pi-arrow-left',
      key: 'Back',
      severity: 'info',
      command: (rowData) => {
        router.navigate(['/admin/employee'])
      }
    })
    this.info.captionButton[1].icon = 'pi pi-calculator';
    this.info.captionButton[1].tooltip = 'Calc Salary for ' + pdfSrv.englishMonths[((new Date).getMonth())] + ' Month';
    this.info.Buttons.push({
      isShow: true,
      tooltip: 'Salary Bill',
      icon: 'pi pi-receipt',
      key: 'receipt',
      severity: 'secondary',
      command: (rowData) => {
        this.billFunc(rowData);
      },
    });

  }
  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(param => {
        if (this.emp.id === 0) {
          this.emp.id = +param['id']
          this.emp.name = param['name']
        }
        this.info.get$ =
          this.info.getSub$.pipe(
            switchMap((body: any) => {
              if (body) {
                return this.salarySrv.getAll(body, this.emp.id).pipe(
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
        return this.contractSrv.getAll({ rows: 10000 }, this.emp.id)
      })
    ).subscribe(res => {
      this.contracts = res.data;
    })
  }
  calc(event: SalaryCreate) {
    this.salarySrv.calculate(event).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
      this.info.getSub$.next({})
      this.calcDialog = false;
      this.calcDialog = false;
    })
  }

  filterContractsByMonth(year: number, month: number): any[] {
    // Create start and end dates for the target month
    const targetMonthStart = new Date(year, month - 1, 1); // month is 0-based in Date
    const targetMonthEnd = new Date(year, month, 0); // Last day of the month
    targetMonthEnd.setHours(23, 59, 59, 999); // Include entire end day

    return this.contracts.filter(contract => {
      const contractStart = new Date(contract.contractStartDate);
      const contractEnd = new Date(contract.contractEndDate);

      // Check if contract overlaps with target month
      return contractStart <= targetMonthEnd &&
        contractEnd >= targetMonthStart;
    }).map(x => {
      return {
        id: x.id,
        name: this.getContractTitle(x)
      }
    });
  }
  getContractTitle(contract: Contract) {
    return `${contract.tittle} from ${this.pdfSrv.englishMonths[(new Date(contract.contractStartDate)).getMonth()]} ${new Date(contract.contractStartDate).getFullYear()} to ${this.pdfSrv.englishMonths[(new Date(contract.contractEndDate)).getMonth()]} ${new Date(contract.contractEndDate).getFullYear()}`;
  }
}
