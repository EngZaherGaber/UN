import { Component, ViewChild } from '@angular/core';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { InsuranceService } from '../../../services/insurance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { DynamicAttributeService } from '../../../../general/services/dynamic-attribute.service';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contract } from '../../../../general/interfaces/contract';
import { ContractService } from '../../../services/contract.service';

@Component({
  selector: 'app-em-insurance',
  imports: [AdTemplateComponent, DynmaicFormComponent, CommonModule],
  templateUrl: './em-insurance.component.html',
  styleUrl: './em-insurance.component.scss'
})
export class EmInsuranceComponent {
  @ViewChild('df') formParent?: DynmaicFormComponent;
  objs: { [key: string]: InputDynamic[] } = {};
  emp: { id: number, name: string } = { id: 0, name: '' };
  firstTime: boolean = true;
  returnIfDisable: { [key: string]: string[] } = {
    general: [
      'endLifeDate',
      'startLifeDate',
      'insuranceCardDeliveredDate'
    ],
  };
  disableAtt: { [key: string]: string[] } = {
    general: ['insuranceLife', 'insuranceMedical']
  };
  contract?: Contract;
  constructor(
    private insuranceSrv: InsuranceService,
    private contractSrv: ContractService,
    private attSrv: DynamicAttributeService,
    private msgSrv: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.pipe(
      switchMap(param => {
        this.emp.id = +param['id'];
        this.emp.name = param['name'];
        return contractSrv.getActiveContractByEmployeeId(this.emp.id);
      }),
      switchMap(res => {
        this.contract = res.data;
        return insuranceSrv.getById(this.emp.id);
      })
    ).subscribe(res => {
      this.objs = {
        general: [
          {
            key: 'insuranceLife',
            label: 'Insurance Life',
            value: this.contract?.insuranceLife,
            dataType: 'bool',
            options: [],
            desc: 'Get From Contract',
            visible: true,
            command: (value, element, form) => {
              this.insuranceLifeCommand(value, element, form, this.objs)
            },
            required: true,
          },
          {
            key: 'insuranceMedical',
            label: 'Insurance Medical',
            value: this.contract?.insuranceMedical,
            dataType: 'bool',
            desc: 'Get From Contract',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'insuranceCardDelivered',
            label: 'Delivered insurance Card',
            value: res.data.insuranceCardDelivered,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => {
              this.deliveredInsuranceCardCommand(value, element, form, this.objs)
            },
            required: true,
          },
          {
            key: 'insuranceCardDeliveredDate',
            label: 'Delivered insurance Card Date',
            value: res.data.insuranceCardDeliveredDate !== null ? res.data.insuranceCardDeliveredDate : new Date(),
            dataType: 'datetime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'startLifeDate',
            label: 'Start Life Date',
            value: res.data.startLifeDate,
            dataType: 'datetime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'endLifeDate',
            label: 'End Life Date',
            value: res.data.endLifeDate,
            dataType: 'datetime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
        ],
      };
    })
  }
  ngAfterViewChecked() {
    if (this.isCorrectObjs() && this.firstTime) {
      this.firstTime = false;
      this.formParent?.listenAgain();
    }
  }
  submit(event: any) {
    const body = {
      employeeId: this.emp.id,
      ...event
    };
    body.startLifeDate = this.attSrv.getStringDate(body.startLifeDate)
    body.endLifeDate = this.attSrv.getStringDate(body.endLifeDate)
    body.insuranceCardDeliveredDate = this.attSrv.getStringDate(body.insuranceCardDeliveredDate)
    this.insuranceSrv.edit(body, this.emp.id).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.router.navigate(['admin/employee']);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }

  isCorrectObjs() {
    return Object.keys(this.objs).length > 0;
  }

  insuranceLifeCommand(value: any, element?: InputDynamic, form?: FormGroup, objs?: { [key: string]: InputDynamic[] }) {
    if (value === true) {
      form?.get('general.startLifeDate')?.enable();
      form?.get('general.endLifeDate')?.enable();
    } else if (value === false) {
      form?.get('general.endLifeDate')?.disable();
      form?.get('general.startLifeDate')?.disable();

    }
  }
  deliveredInsuranceCardCommand(value: any, element?: InputDynamic, form?: FormGroup, objs?: { [key: string]: InputDynamic[] }) {
    const control = form?.get('general.insuranceCardDeliveredDate');
    if (value === true) {
      control?.enable();
    } else if (value === false) {
      control?.disable();
    }
  }
}
