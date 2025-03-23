import { Component } from '@angular/core';
import { AdTemplateComponent } from "../../ad-template/ad-template.component";
import { DynmaicFormComponent } from "../../../../general/components/dynmaic-form/dynmaic-form.component";
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { CooService } from '../../../services/coo.service';
import { BankService } from '../../../services/bank.service';
import { ClientService } from '../../../services/client.service';
import { TeamService } from '../../../services/team.service';
import { PoService } from '../../../services/po.service';
import { CityService } from '../../../services/city.service';
import { forkJoin } from 'rxjs';
import { TypeOfContractService } from '../../../services/type-of-contract.service';
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
    citySrv: CityService,
    cooSrv: CooService,
    bankSrv: BankService,
    clntSrv: ClientService,
    teamSrv: TeamService,
    poSrv: PoService,
    typeofContractSrv: TypeOfContractService,
    private empSrv: EmployeeService,
    private msgSrv: ToastService,
    private router: Router
  ) {
    forkJoin({
      cities: citySrv.getAll(),
      coos: cooSrv.getAll(),
      banks: bankSrv.getAll(),
      clients: clntSrv.getAll(),
      teams: teamSrv.getAll(),
      types: typeofContractSrv.getAll(),
      pos: poSrv.getAll(),
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
            dataType: 'int',
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
        ],
        backgroundcheck: [
          {
            key: 'medicalCheck',
            label: 'Medical Check',
            value: null,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'oldEmployment',
            label: 'Old Employment',
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
            required: true,
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
        ],
        contractInfo: [
          {
            key: 'clientId',
            label: 'Client Name',
            value: null,
            dataType: 'list',
            options: res.clients.data.map(client => {
              return { id: client.clientId, name: client.clientName }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'teamId',
            label: 'Team Name',
            value: null,
            dataType: 'list',
            options: res.teams.data.map(team => {
              return { id: team.teamId, name: team.teamName }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'cooId',
            label: 'COO Name',
            value: null,
            dataType: 'list',
            options: res.coos.data.map(coo => {
              return { id: coo.cooId, name: coo.cooNumber }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'cooPoId',
            label: 'COO PO Name',
            value: null,
            dataType: 'list',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'cityId',
            label: 'City Name',
            value: null,
            dataType: 'list',
            options: res.cities.data.map(city => {
              return { id: city.cityId, name: city.nameEn }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'typeOfContractId',
            label: 'Type Of Contract',
            value: null,
            dataType: 'list',
            options: res.types.data.map(type => {
              return { id: type.typeOfContractId, name: type.nmaeEn }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },

          {
            key: 'contractStartDate',
            label: 'Contract Start Date',
            value: null,
            dataType: 'DateTime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'contractEndDate',
            label: 'Contract End Date',
            value: null,
            dataType: 'DateTime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'startLifeDate',
            label: 'Start Life Date',
            value: null,
            dataType: 'DateTime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'endLifeDate',
            label: 'End Life Date',
            value: null,
            dataType: 'DateTime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'tittle',
            label: 'Title',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'superVisor',
            label: 'Super Visor',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'areaManager',
            label: 'Area Manager',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'projectName',
            label: 'Project Name',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'salary',
            label: 'Salary',
            value: null,
            dataType: 'int',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'laptop',
            label: 'Laptop',
            value: null,
            dataType: 'int',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },

          {
            key: 'contractSigned',
            label: 'Contract Signed',
            value: null,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'transportation',
            label: 'Transportation',
            value: null,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },

          {
            key: 'isMobile',
            label: 'Have Mobile',
            value: null,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },

          {
            key: 'insuranceLife',
            label: 'Insurance Life',
            value: null,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },

          {
            key: 'insuranceMedical',
            label: 'Insurance Medical',
            value: null,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },

          {
            key: 'active',
            label: 'Bank Name',
            value: true,
            dataType: 'bool',
            options: [],
            visible: false,
            command: (value, element, form) => { },
            required: true,
          },
        ]
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
