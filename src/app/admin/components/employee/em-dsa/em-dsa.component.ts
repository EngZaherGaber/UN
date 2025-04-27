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
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { PdfService } from '../../../../general/services/pdf.service';
import { CompanyAccountService } from '../../../services/company-account.service';
import { CopmanyAccount } from '../../../../general/interfaces/company-account';
import { BillZeroTemplateComponent } from '../../../../general/components/bill-zero-template/bill-zero-template.component';
import { BillOneTemplateComponent } from '../../../../general/components/bill-one-template/bill-one-template.component';
import { BillTwoTemplateComponent } from '../../../../general/components/bill-two-template/bill-two-template.component';
import { BillThreeTemplateComponent } from '../../../../general/components/bill-three-template/bill-three-template.component';
import { DSA } from '../../../../general/interfaces/dsa';
@Component({
  selector: 'em-dsa',
  imports: [
    DynamicTableComponent,
    AdTemplateComponent,
    DialogModule,
    CommonModule,
    DynmaicFormComponent,
    BillZeroTemplateComponent,
    BillOneTemplateComponent,
    BillTwoTemplateComponent,
    BillThreeTemplateComponent
  ],
  templateUrl: './em-dsa.component.html',
  styleUrl: './em-dsa.component.scss'
})
export class EmDSAComponent {
  @Input() emp: { id: number, name: string } = { id: 0, name: '' };
  info: InfoTable;
  dsaRow: any;
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
      field: 'dsaValue',
      header: 'DSA Value',
      HeaderType: 'int',
    },
    {
      field: 'month',
      header: 'month',
      HeaderType: 'int',
    },
    {
      field: 'year',
      header: 'year',
      HeaderType: 'int',
    },
    {
      field: 'clientName',
      header: 'clientName',
      HeaderType: 'string',
    },
    {
      field: 'teamName',
      header: 'teamName',
      HeaderType: 'string',
    },

  ];
  month: number = (new Date()).getMonth() + 1;
  calcDialog: boolean = false;
  billObjs: { [key: string]: InputDynamic[] } = {};
  billDialog: boolean = false;
  zeroBillPreviewDialog: boolean = false;
  oneBillPreviewDialog: boolean = false;
  twoBillPreviewDialog: boolean = false;
  threeBillPreviewDialog: boolean = false;
  companyAccounts: CopmanyAccount[] = [];
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
          key: 'dsaValue',
          label: 'DSA Value',
          value: null,
          dataType: 'int',
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
          key: 'year',
          label: 'Year',
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
    this.dsaRow = rowData;
    this.billObjs = {
      template: [
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
          key: 'dsaValue',
          label: 'DSA Value',
          value: rowData.dsaValue,
          dataType: 'int',
          required: true,
          visible: false,
          options: [],
        },
        {
          key: 'template',
          label: 'Template',
          value: null,
          dataType: 'list',
          required: true,
          visible: true,
          options: [
            { id: 0, name: 'التجاري' },
            { id: 1, name: 'البركة' },
            { id: 2, name: 'الاهلي (داخلي)' },
            { id: 3, name: 'الاهلي (خارجي)' },
          ],
        },
      ],
      description: [
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
          key: 'reason',
          label: 'Reason',
          value: 'راتب شهر ' + this.pdfSrv.englishMonths[new Date().getMonth()],
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'ourAccount',
          label: 'Our Account',
          value: null,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.companyAccounts.map(res => {
            return { id: res.accountNumber, name: res.accountNumber }
          }),
        },
      ],
    };
    this.billDialog = true

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
    this.companyAccountSrv.getAll().subscribe(res => this.companyAccounts = res.data)
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
    this.info.captionButton[1].tooltip = 'Calc DSA';
    this.info.Buttons.push({
      isShow: true,
      tooltip: 'DSA Bill',
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
              return this.salarySrv.getAllDSA(body, this.emp.id).pipe(
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
  calc(event: DSA) {
    this.salarySrv.addDSA(event).subscribe(res => {
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
  async generateBill(event: any) {
    this.billDialog = false;
    this.dsaRow = {
      ...this.dsaRow,
      event
    }
    console.log(this.dsaRow);
    switch (event.template.template) {
      case 0:
        this.zeroBillPreviewDialog = true;
        break;
      case 1:
        this.oneBillPreviewDialog = true;
        break;
      case 2:
        this.twoBillPreviewDialog = true;
        break;
      case 3:
        this.threeBillPreviewDialog = true;
        break;

      default:
        break;
    }
  }

}
