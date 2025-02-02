import { Component, Input } from '@angular/core';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { ReplaySubject, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../../../general/services/toast.service';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { DyButton } from '../../../../general/interfaces/dy-button';

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
      severity: 'warn',
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
    private router: Router
  ) {}
  ngOnInit(): void {
    this.info.get$ = this.tblSrv.getLibObs(
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body === true) {
            return of({
              data: {
                model: [
                  {
                    name: 'Zaher',
                    age: 20,
                    email: 'zaher@example.com',
                    address: '123 Main St',
                    isStudent: true,
                    salary: null,
                    height: 175.5,
                    birthDate: '2003-05-15',
                    phoneNumber: '123-456-7890',
                    nationality: 'Jordanian',
                  },
                  {
                    name: 'Lina',
                    age: 25,
                    email: 'lina@example.com',
                    address: '456 Elm St',
                    isStudent: false,
                    salary: 50000,
                    height: 162.0,
                    birthDate: '1998-08-22',
                    phoneNumber: '987-654-3210',
                    nationality: 'Lebanese',
                  },
                  {
                    name: 'Omar',
                    age: 30,
                    email: 'omar@example.com',
                    address: '789 Oak St',
                    isStudent: false,
                    salary: 75000,
                    height: 180.0,
                    birthDate: '1993-11-10',
                    phoneNumber: '555-123-4567',
                    nationality: 'Egyptian',
                  },
                  {
                    name: 'Sara',
                    age: 22,
                    email: 'sara@example.com',
                    address: '321 Pine St',
                    isStudent: true,
                    salary: null,
                    height: 168.0,
                    birthDate: '2001-02-28',
                    phoneNumber: '444-555-6666',
                    nationality: 'Saudi',
                  },
                  {
                    name: 'Ali',
                    age: 28,
                    email: 'ali@example.com',
                    address: '654 Cedar St',
                    isStudent: false,
                    salary: 60000,
                    height: 178.0,
                    birthDate: '1995-07-19',
                    phoneNumber: '777-888-9999',
                    nationality: 'Emirati',
                  },
                  {
                    name: 'Nour',
                    age: 19,
                    email: 'nour@example.com',
                    address: '987 Birch St',
                    isStudent: true,
                    salary: null,
                    height: 160.0,
                    birthDate: '2004-09-05',
                    phoneNumber: '222-333-4444',
                    nationality: 'Syrian',
                  },
                  {
                    name: 'Yousef',
                    age: 35,
                    email: 'yousef@example.com',
                    address: '135 Maple St',
                    isStudent: false,
                    salary: 90000,
                    height: 182.0,
                    birthDate: '1988-12-25',
                    phoneNumber: '111-222-3333',
                    nationality: 'Kuwaiti',
                  },
                  {
                    name: 'Hala',
                    age: 27,
                    email: 'hala@example.com',
                    address: '246 Walnut St',
                    isStudent: false,
                    salary: 55000,
                    height: 165.0,
                    birthDate: '1996-04-12',
                    phoneNumber: '666-777-8888',
                    nationality: 'Iraqi',
                  },
                  {
                    name: 'Kareem',
                    age: 24,
                    email: 'kareem@example.com',
                    address: '369 Spruce St',
                    isStudent: true,
                    salary: null,
                    height: 170.0,
                    birthDate: '1999-10-30',
                    phoneNumber: '999-000-1111',
                    nationality: 'Palestinian',
                  },
                  {
                    name: 'Layla',
                    age: 21,
                    email: 'layla@example.com',
                    address: '482 Fir St',
                    isStudent: true,
                    salary: null,
                    height: 167.0,
                    birthDate: '2002-03-17',
                    phoneNumber: '333-444-5555',
                    nationality: 'Qatari',
                  },
                ],
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
          } else {
            return of({
              loading: true,
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
