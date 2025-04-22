import { Component } from '@angular/core';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { of, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { EmployeeService } from '../../../services/employee.service';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ad-general-employee',
  imports: [
    AdTemplateComponent,
    DynamicTableComponent,
    CommonModule
  ],
  templateUrl: './ad-general-employee.component.html',
  styleUrl: './ad-general-employee.component.scss',
})
export class AdGeneralEmployeeComponent {
  info: InfoTable;
  columns = [
    {
      field: 'active',
      header: 'Active',
      HeaderType: 'bool',
    },
    {
      field: 'empName',
      header: 'English Name',
      HeaderType: 'string',
    },
    {
      field: 'arabicName',
      header: 'arabicName',
      HeaderType: 'string',
    },
    {
      field: 'motherNameArabic',
      header: 'motherNameArabic',
      HeaderType: 'string',
    },
    {
      field: 'fatherNameArabic',
      header: 'fatherNameArabic',
      HeaderType: 'string',
    },
    {
      field: 'idNo',
      header: 'idNo',
      HeaderType: 'string',
    },
    {
      field: 'emailAddress',
      header: 'emailAddress',
      HeaderType: 'string',
    },
    {
      field: 'mobileNo',
      header: 'mobileNo',
      HeaderType: 'string',
    },
    {
      field: 'gender',
      header: 'gender',
      HeaderType: 'string',
    },
    {
      field: 'bankName',
      header: 'Bank Name',
      HeaderType: 'string',
    },
    {
      field: 'typeOfAcc',
      header: 'Type of Account',
      HeaderType: 'string',
    },
    {
      field: 'accountNumber',
      header: 'Account Number',
      HeaderType: 'string',
    },
    {
      field: 'isDelegated',
      header: 'With Delegation',
      HeaderType: 'bool',
    },
  ];
  changeColor(rowData: any) {
    if (!rowData.active) {
      return {
        background: '#babfc5bf',
        color: '#858585'
      }
    }
    return '';
  }
  addFunc: () => void = () => {
    this.router.navigate(['admin/employee/add'])
  }
  editFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/employee/edit', rowData.refNo])
  }
  displayFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/employee/display', rowData.refNo])
  }
  insuranceFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/employee/insurance', rowData.refNo, rowData.empName])
  }
  salaryFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/employee/salary', rowData.refNo, rowData.empName])
  }
  contractFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/employee/contract', rowData.refNo, rowData.empName])
  }
  dsaFunc: (rowData: any) => void = async (rowData: any) => {
    this.router.navigate(['admin/employee/dsa', rowData.refNo, rowData.empName])
  }
  constructor(
    tblSrv: DyTableService,
    private router: Router,
    private empSrv: EmployeeService,
  ) {
    this.info = tblSrv.getStandardInfo(undefined, this.editFunc, this.displayFunc, this.addFunc);
    this.info.Buttons.push({
      isShow: false,
      tooltip: 'Employee Insurance',
      icon: 'pi pi-heart',
      key: 'Delete',
      severity: 'secondary',
      command: (rowData) => {
        this.insuranceFunc(rowData);
      },
      showCommand: (body: any) => {
        return body.active
      }
    });
    this.info.Buttons.push({
      isShow: false,
      tooltip: 'Employee Salary',
      icon: 'pi pi-dollar',
      key: 'Delete',
      severity: 'secondary',
      command: (rowData) => {
        this.salaryFunc(rowData);
      },
      showCommand: (body: any) => {
        return body.active
      }
    });
    this.info.Buttons.push({
      isShow: true,
      tooltip: 'Employee Contract',
      icon: 'pi pi-book',
      key: 'Delete',
      severity: 'secondary',
      command: (rowData) => {
        this.contractFunc(rowData);
      },
    });
    this.info.Buttons.push({
      isShow: false,
      tooltip: 'Employee DSA',
      icon: 'pi pi-car',
      key: 'DSA',
      severity: 'secondary',
      command: (rowData) => {
        this.dsaFunc(rowData);
      },
      showCommand: (body: any) => {
        return body.active
      }
    });
  }
  ngOnInit(): void {
    this.info.get$ =
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body) {
            return this.empSrv.getAll(body).pipe(
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
  }
  
}
