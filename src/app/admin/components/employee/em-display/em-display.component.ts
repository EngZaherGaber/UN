import { Component } from '@angular/core';
import { AdTemplateComponent } from "../../ad-template/ad-template.component";
import { DynmaicFormComponent } from "../../../../general/components/dynmaic-form/dynmaic-form.component";
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { CooService } from '../../../services/coo.service';
import { BankService } from '../../../services/bank.service';
import { ClientService } from '../../../services/client.service';
import { TeamService } from '../../../services/team.service';
import { CityService } from '../../../services/city.service';
import { forkJoin, switchMap } from 'rxjs';
import { TypeOfContractService } from '../../../services/type-of-contract.service';
import { EmployeeService } from '../../../services/employee.service';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../../general/interfaces/employee';

@Component({
  selector: 'app-em-display',
  imports: [AdTemplateComponent, DynmaicFormComponent],
  templateUrl: './em-display.component.html',
  styleUrl: './em-display.component.scss'
})
export class EmDisplayComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  empId: number = 0;
  emp?: Employee;
  constructor(
    bankSrv: BankService,
    private empSrv: EmployeeService,
    private msgSrv: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.params.pipe(
      switchMap(param => {
        this.empId = param['id'];
        return forkJoin({
          banks: bankSrv.getAll(),
          emp: this.empSrv.getById(this.empId)
        })
      })
    )
      .subscribe(res => {
        this.objs = {
          personal: [
            {
              key: 'empName',
              label: 'Employee Name',
              value: res.emp.data.personal.empName,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'arabicName',
              label: 'Arabic Name',
              value: res.emp.data.personal.arabicName,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'motherNameArabic',
              label: 'Mother Name (Arabic)',
              value: res.emp.data.personal.motherNameArabic,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'fatherNameArabic',
              label: 'Father Name (Arabic)',
              value: res.emp.data.personal.fatherNameArabic,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'idNo',
              label: 'ID NO.',
              value: res.emp.data.personal.idNo,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'emailAddress',
              label: 'Email',
              value: res.emp.data.personal.emailAddress,
              dataType: 'email',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'mobileNo',
              label: 'Mobile No.',
              value: res.emp.data.personal.mobileNo,
              dataType: 'int',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'gender',
              label: 'Gender',
              value: res.emp.data.personal.gender,
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
          ],
          bankInfo: [
            {
              key: 'bankId',
              label: 'Bank Name',
              value: res.emp.data.bankInfo.bankId,
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
              value: res.emp.data.bankInfo.typeOfAcc,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'accountNumber',
              label: 'Account Number',
              value: res.emp.data.bankInfo.accountNumber,
              dataType: 'string',
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
