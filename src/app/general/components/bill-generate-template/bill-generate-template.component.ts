import { Component, Input, ViewChild } from '@angular/core';
import { DynmaicFormComponent } from '../dynmaic-form/dynmaic-form.component';
import { SalaryService } from '../../../admin/services/salary.service';
import { InputDynamic } from '../../interfaces/input-dynamic';
import { PdfService } from '../../services/pdf.service';
import { CompanyAccountService } from '../../../admin/services/company-account.service';
import { CopmanyAccount } from '../../interfaces/company-account';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AdTemplateComponent } from '../../../admin/components/ad-template/ad-template.component';
import { EmployeeService } from '../../../admin/services/employee.service';
import { Salary } from '../../interfaces/salary';
import { DynamicAttributeService } from '../../services/dynamic-attribute.service';
import { CommonModule } from '@angular/common';
import { Employee } from '../../interfaces/employee';
import { Bill } from '../../interfaces/bill';
import { BillZeroTemplateComponent } from '../bill-zero-template/bill-zero-template.component';
import { MenuItem } from 'primeng/api';
import { BillOneTemplateComponent } from '../bill-one-template/bill-one-template.component';
import { BillTwoTemplateComponent } from '../bill-two-template/bill-two-template.component';
import { BillThreeTemplateComponent } from '../bill-three-template/bill-three-template.component';
import { TabsModule } from 'primeng/tabs';
import { BankService } from '../../../admin/services/bank.service';
import { Bank } from '../../interfaces/bank';

@Component({
  selector: 'bill-generate-template',
  imports: [
    DynmaicFormComponent,
    AdTemplateComponent,
    CommonModule,
    BillZeroTemplateComponent,
    BillOneTemplateComponent,
    BillTwoTemplateComponent,
    BillThreeTemplateComponent,
    TabsModule,
  ],
  templateUrl: './bill-generate-template.component.html',
  styleUrl: './bill-generate-template.component.scss'
})
export class BillGenerateTemplateComponent {
  @ViewChild('df') formParent?: DynmaicFormComponent;
  @Input() emp: { id: number, name: string } = { id: 0, name: '' };
  salaryId: number = 0;
  companyAccounts: CopmanyAccount[] = [];
  banks: Bank[] = [];
  billObjs: { [key: string]: InputDynamic[] } = {};
  salaryRow: Salary | undefined;
  employee: Employee | undefined;
  firstTime: boolean = true;
  bills?: { [key: string]: Bill };
  templateList = [
    { id: 0, name: 'التجاري' },
    { id: 1, name: 'البركة' },
    { id: 2, name: 'الاهلي (داخلي)' },
    { id: 3, name: 'الاهلي (خارجي)' },
  ];
  templateListSelected: string[] = [];
  stepsList: MenuItem[] = []
  activeIndex: number = 0;
  showBills: boolean = false;

  constructor(
    private salarySrv: SalaryService,
    private pdfSrv: PdfService,
    private empSrv: EmployeeService,
    private companyAccountSrv: CompanyAccountService,
    private route: ActivatedRoute,
    private bnkSrv: BankService,
    private dyAttSrv: DynamicAttributeService,
  ) {
    this.companyAccountSrv.getAll().subscribe(res => this.companyAccounts = res.data)
    this.bnkSrv.getAll().subscribe(res => this.banks = res.data)

  }

  ngAfterViewInit() {
    this.route.params.pipe(
      switchMap(res => {
        this.emp.id = res['id'];
        this.emp.name = res['name'];
        this.salaryId = res['salaryId'];
        return this.salarySrv.getById(this.salaryId)
      }),
      switchMap(res => {
        this.salaryRow = res.data;
        return this.empSrv.getById(this.emp.id)
      })
    ).subscribe(res => {
      this.employee = res.data
      this.billObjs = {
        employee: [
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
            key: 'employeeName',
            label: 'employee Name',
            value: this.emp.name,
            dataType: 'string',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'salaryId',
            label: 'Total Salary',
            value: this.salaryRow?.totalSalaryCalculatedinSyrianPounds,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'delegate',
            label: 'Is Delegate',
            value: this.employee.bankInfo.isDelegated,
            dataType: 'bool',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'basicSalaryinUSD',
            label: 'Salary (USD)',
            value: this.salaryRow?.basicSalaryinUSD,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'mobile',
            label: 'mobile',
            value: this.salaryRow?.mobile,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'transportation',
            label: 'transportation',
            value: this.salaryRow?.transportation,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'sickLeave',
            label: 'sickLeave',
            value: this.salaryRow?.sickLeave,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'daysOff',
            label: 'daysOff',
            value: this.salaryRow?.daysOff,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'downPayment',
            label: 'downPayment',
            value: this.salaryRow?.downPayment,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'overTimeWages',
            label: 'overTimeWages',
            value: this.salaryRow?.overTimeWages,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'totalSalaryCalculatedinSyrianPounds',
            label: 'Calculated Salary (SYP)',
            value: this.salaryRow?.totalSalaryCalculatedinSyrianPounds,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'bonuses',
            label: 'bonuses',
            value: this.salaryRow?.bonuses,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'netSalary',
            label: 'netSalary',
            value: this.salaryRow?.netSalary,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'laptop',
            label: 'laptop',
            value: this.salaryRow?.laptop,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
          {
            key: 'deductions',
            label: 'deductions',
            value: this.salaryRow?.deductions,
            dataType: 'int',
            required: true,
            visible: true,
            options: [],
          },
        ],
        template: [
          {
            key: 'templateId',
            label: 'Templates',
            value: null,
            dataType: 'MultiSelect',
            required: true,
            visible: true,
            options: this.templateList,
            command: (value, element, form, objs) => {
              if (!this.firstTime) {
                const newObjs = objs;
                this.templateList.forEach(template => {
                  const x = (value as any[]).find(x => x === template.id);
                  if (x !== undefined) {
                    const arr = [
                      {
                        key: 'price',
                        label: 'Price Of Bill',
                        value: null,
                        dataType: 'int',
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
                      {
                        key: 'delegateName',
                        label: 'Delegate Name',
                        value: null,
                        dataType: 'string',
                        required: true,
                        visible: this.employee?.bankInfo.isDelegated,
                        options: [],
                      },
                      {
                        key: 'delegateNo',
                        label: 'Delegate Account',
                        value: null,
                        dataType: 'string',
                        required: true,
                        visible: this.employee?.bankInfo.isDelegated,
                        options: [],
                      },
                      {
                        key: 'AccountNo',
                        label: 'Employee Account',
                        value: this.employee?.bankInfo.accountNumber,
                        dataType: 'string',
                        required: true,
                        visible: !this.employee?.bankInfo.isDelegated,
                        options: [],
                      },
                      {
                        key: 'bankName',
                        label: 'Employee Bank',
                        value: this.banks.find(x => x.banksId === this.employee?.bankInfo.bankId)?.banksName,
                        dataType: 'list',
                        required: true,
                        visible: true,
                        options: this.banks.map(x => {
                          return {
                            id: x.banksName,
                            name: x.banksName
                          }
                        }),
                      },
                      {
                        key: 'branch',
                        label: 'Sender Bank Branch',
                        value: null,
                        dataType: 'string',
                        required: true,
                        visible: true,
                        options: [],
                      },
                      {
                        key: 'reason',
                        label: 'Reason',
                        value: 'راتب شهر ' + this.pdfSrv.englishMonths[this.salaryRow ? this.salaryRow.slaryMonth : 0],
                        dataType: 'string',
                        required: true,
                        visible: true,
                        options: [],
                      },
                    ]
                    this.billObjs ? (this.billObjs as any)[template.name] = arr : '';
                  } else if (this.billObjs[template.name]) {
                    this.templateListSelected = this.templateListSelected.filter(x => x !== template.name);
                  }
                  this.templateListSelected = (value as any[]).map(x => this.templateList.find(z => z.id === x)?.name).filter(x => x !== undefined)
                });
                this.formParent?.resetForm();
                this.formParent?.reLoad();
              }
            }
          },
        ],
      };
    })
  }
  ngAfterViewChecked() {
    if (Object.keys(this.billObjs).length > 0 && this.firstTime) {
      this.firstTime = false;
      this.formParent?.listenAgain();
    }
  }
  fillObject() {
    return Object.keys(this.billObjs).length > 0 && !this.showBills;
  }
  generateBill(event: any) {
    this.templateListSelected.forEach(x => {
      const newItem: Bill = {
        branch: event[x].branch,
        reason: event[x].reason,
        price: event[x].price,
        ourAccount: event[x].ourAccount,
        employeeName: this.employee?.bankInfo.isDelegated ? event[x].delegateName : this.employee?.personal.arabicName + ' بن ' + this.employee?.personal.fatherNameArabic,
        employeeAccount: this.employee?.bankInfo.isDelegated ? event[x].delegateNo : this.employee?.bankInfo.accountNumber,
        bankName: event[x].bankName,
      };
      if (this.bills) {
        (this.bills as any)[x] = newItem;
      } else {
        this.bills = {
          [x]: newItem
        }
      }
    })
    this.stepsList = this.templateListSelected.map(x => {
      return {
        label: x
      }
    });
    this.showBills = true;
  }
  activeIndexChange(event: number) {
    this.activeIndex = event - 2;
  }
}
