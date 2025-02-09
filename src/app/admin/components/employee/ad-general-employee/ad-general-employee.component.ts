import { Component, Input } from '@angular/core';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { ReplaySubject, Observable, of, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../../../general/services/toast.service';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { DyButton } from '../../../../general/interfaces/dy-button';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'ad-general-employee',
  imports: [AdTemplateComponent, DynamicTableComponent],
  templateUrl: './ad-general-employee.component.html',
  styleUrl: './ad-general-employee.component.scss',
})
export class AdGeneralEmployeeComponent {
  captionButton: DyButton[] = [
    {
      isShow: true,
      tooltip: 'Add New Item',
      icon: 'pi pi-plus',
      key: 'Add',
      severity: 'primary',
    },
  ];
  Buttons: DyButton[] = [
    {
      isShow: true,
      tooltip: 'Attach Managment',
      icon: 'pi pi-paperclip',
      key: 'Attach',
      severity: 'help',
    },
    {
      isShow: true,
      tooltip: 'Item Details',
      icon: 'pi pi-eye',
      key: 'Details',
    },
    {
      isShow: true,
      tooltip: 'Edit Item',
      icon: 'pi pi-pencil',
      key: 'Edit',
    },
    {
      isShow: true,
      tooltip: 'Delete Item',
      icon: 'pi pi-trash',
      key: 'Delete',
    },
  ];
  info = {
    getSub$: new ReplaySubject(),
    get$: new Observable(),
    type: 'Employee',
    columnsEvent: [
      {
        field: 'isStudent',
      },
    ],
  };
  constructor(
    private msgSrv: ToastService,
    private tblSrv: DyTableService,
    private router: Router,
    private empSrv: EmployeeService
  ) { }
  ngOnInit(): void {
    this.info.get$ = this.tblSrv.getLibObs(
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body === true) {
            return this.empSrv.getAll().pipe(
              switchMap(res => {
                debugger
                return of({
                  data: {
                    model: res.data,
                    type: [
                      {
                        attribute: 'name',
                        dynamic: null,
                        dataType: 'string',
                      },
                      {
                        attribute: 'age',
                        dynamic: null,
                        dataType: 'int',
                      },
                      {
                        attribute: 'email',
                        dynamic: null,
                        dataType: 'string',
                      },
                      {
                        attribute: 'address',
                        dynamic: null,
                        dataType: 'string',
                      },
                      {
                        attribute: 'isStudent',
                        dynamic: null,
                        dataType: 'bool',
                      },
                      {
                        attribute: 'salary',
                        dynamic: null,
                        dataType: 'float',
                      },
                      {
                        attribute: 'height',
                        dynamic: null,
                        dataType: 'float',
                      },
                      {
                        attribute: 'birthDate',
                        dynamic: null,
                        dataType: 'DateTime',
                      },
                      {
                        attribute: 'phoneNumber',
                        dynamic: null,
                        dataType: 'string',
                      },
                      {
                        attribute: 'nationality',
                        dynamic: null,
                        dataType: 'string',
                      },
                    ],
                  },
                });

              })
            )
          } else {
            return of({
              loading: false,
              data: [],
              columns: [],
            });
          }
        })
      ),
      ['Id', 'Deleted'],
      ['isStudent']
    );
    this.info.getSub$.next(true);
  }
}
