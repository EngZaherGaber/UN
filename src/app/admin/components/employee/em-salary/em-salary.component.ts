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
import { Salary } from '../../../../general/interfaces/salary';

@Component({
  selector: 'app-em-salary',
  imports: [DynamicTableComponent, AdTemplateComponent, DialogModule, CommonModule, DynmaicFormComponent],
  templateUrl: './em-salary.component.html',
  styleUrl: './em-salary.component.scss'
})
export class EmSalaryComponent {
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
  month: number = (new Date()).getMonth() + 1;
  calcDialog: boolean = false;
  @Input() emp: { id: number, name: string } = { id: 0, name: '' };
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
          key: 'dsa',
          label: 'DSA',
          value: null,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },

      ],
    };
    this.calcDialog = true;
  }
  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private router: Router,
    private salarySrv: SalaryService,
    private confirm: ConfirmService,
    private route: ActivatedRoute
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
    this.info.captionButton[1].tooltip = 'Calc Salary for ' + this.month + ' Month';
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
  calc(event: Salary) {
    this.salarySrv.calculate(event).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
      this.info.getSub$.next(true)
      this.calcDialog = false;
    })
  }
}
