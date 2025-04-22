import { Component } from '@angular/core';
import { AdTemplateComponent } from "../../ad-template/ad-template.component";
import { DynmaicFormComponent } from "../../../../general/components/dynmaic-form/dynmaic-form.component";
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { BankService } from '../../../services/bank.service';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-em-add',
  imports: [AdTemplateComponent, DynmaicFormComponent],
  templateUrl: './em-add.component.html',
  styleUrl: './em-add.component.scss'
})
export class EmAddComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  constructor(
    bankSrv: BankService,
    private empSrv: EmployeeService,
    private msgSrv: ToastService,
    private router: Router
  ) {
    forkJoin({
      banks: bankSrv.getAll(),
    }).subscribe(res => {
      this.objs = {
        personal: [
          {
            key: 'empName',
            label: 'Employee Name',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'arabicName',
            label: 'Arabic Name',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'motherNameArabic',
            label: 'Mother Name (Arabic)',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'fatherNameArabic',
            label: 'Father Name (Arabic)',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'idNo',
            label: 'ID NO.',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'emailAddress',
            label: 'Email',
            value: null,
            dataType: 'email',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'mobileNo',
            label: 'Mobile No.',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'gender',
            label: 'Gender',
            value: null,
            dataType: 'list',
            options: [
              {
                id: 0,
                name: 'Male'
              },
              {
                id: 1,
                name: 'Female'
              },
            ],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'oldEmployment',
            label: 'Is Old Employee',
            value: null,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'securityCheck',
            label: 'Security Check',
            value: null,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
        ],
        bankInfo: [
          {
            key: 'bankId',
            label: 'Bank Name',
            value: null,
            dataType: 'list',
            options: res.banks.data.map(bank => {
              return { id: bank.banksId, name: bank.banksName }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'typeOfAcc',
            label: 'Type Of Acc',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: false,
          },
          {
            key: 'accountNumber',
            label: 'Account Number',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'isDelegated',
            label: 'With Delegation',
            value: false,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
        ],
      };
    })
  }
  submit(event: any) {
    this.empSrv.add(event).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.router.navigate(['admin/employee']);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
