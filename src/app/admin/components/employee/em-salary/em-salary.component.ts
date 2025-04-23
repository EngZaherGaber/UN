import { Component, Input } from '@angular/core';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { ToastService } from '../../../../general/services/toast.service';
import { switchMap, of, catchError } from 'rxjs';
import { SalaryService } from '../../../services/salary.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { SalaryCreate } from '../../../../general/interfaces/salary-create';
import { PdfService } from '../../../../general/services/pdf.service';
import { CompanyAccountService } from '../../../services/company-account.service';
@Component({
  selector: 'em-salary',
  imports: [
    DynamicTableComponent,
    AdTemplateComponent,
    DialogModule,
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
          key: 'laptopcompensation',
          label: 'Laptop Compensation',
          value: null,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'mobilecompensation',
          label: 'Mobile Compensation',
          value: null,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'transportioncompensation',
          label: 'Transportion Compensation',
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
        },
        {
          key: 'year',
          label: 'year',
          value: null,
          dataType: 'year',
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
    private confirm: ConfirmService,
    private route: ActivatedRoute,
    private pdfSrv: PdfService,
    private companyAccountSrv: CompanyAccountService
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
    this.info.captionButton[1].tooltip = 'Calc Salary for ' + (new Date()).getMonth() + 1 + ' Month';
    this.info.Buttons.push({
      isShow: true,
      tooltip: 'Salary Bill',
      icon: 'pi pi-receipt',
      key: 'receipt',
      severity: 'secondary',
      command: (rowData) => {
        this.billFunc(rowData);
      },
    })
  }
  ngOnInit(): void {
    this.route.params.subscribe(param => {
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

}
