import { Component, Input } from '@angular/core';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { ReplaySubject, Observable, of, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../../../general/services/toast.service';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { DyButton } from '../../../../general/interfaces/dy-button';
import { EmployeeService } from '../../../services/employee.service';
import { InfoTable } from '../../../../general/interfaces/info-table';

@Component({
  selector: 'ad-general-employee',
  imports: [AdTemplateComponent, DynamicTableComponent],
  templateUrl: './ad-general-employee.component.html',
  styleUrl: './ad-general-employee.component.scss',
})
export class AdGeneralEmployeeComponent {
  info: InfoTable;
  columnsEvent = [
    {
      field: 'isStudent',
    },
  ]
  addFunc: () => void = () => {
    this.router.navigate(['admin/employee/add'])
  }

  constructor(
    private msgSrv: ToastService,
    private tblSrv: DyTableService,
    private router: Router,
    private empSrv: EmployeeService
  ) {
    this.info = tblSrv.getStandardInfo(undefined, undefined, undefined, this.addFunc)
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
                  columns: [
                    {
                      field: 'refNo',
                      header: 'refNo',
                      HeaderType: 'int',
                    },
                    {
                      field: 'empName',
                      header: 'empName',
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
                      HeaderType: 'int',
                    },
                    {
                      field: 'gender',
                      header: 'gender',
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
                      field: 'userName',
                      header: 'userName',
                      HeaderType: 'string',
                    },
                    {
                      field: 'roleName',
                      header: 'roleName',
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
                  field: 'userName',
                  header: 'userName',
                  HeaderType: 'string',
                },
                {
                  field: 'roleName',
                  header: 'roleName',
                  HeaderType: 'string',
                },
              ],
            });
          }
        })
      );
  }
}
