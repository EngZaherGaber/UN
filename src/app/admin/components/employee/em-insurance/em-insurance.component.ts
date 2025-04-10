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

@Component({
  selector: 'app-em-insurance',
  imports: [AdTemplateComponent, DynmaicFormComponent, CommonModule],
  templateUrl: './em-insurance.component.html',
  styleUrl: './em-insurance.component.scss'
})
export class EmInsuranceComponent {
  @ViewChild('df') formParent?: DynmaicFormComponent;
  objs?: { [key: string]: InputDynamic[] };
  emp: { id: number, name: string } = { id: 0, name: '' };
  firstTime: boolean = true;
  triggers: {
    [key: string]: {
      key: string;
      command: (
        event?: any,
        element?: InputDynamic,
        form?: FormGroup,
        objs?: any,
        dySrv?: DynamicAttributeService
      ) => void;
    }[];
  } = {
      general: [
        {
          key: 'insuranceLife',
          command: this.insuranceLifeCommand,
        },
        {
          key: 'insuranceMedical',
          command: this.insuranceMedicalCommand,
        },

      ],

    };
  returnIfDisable: { [key: string]: string[] } = {
    general: [
      'endLifeDate',
      'startLifeDate',
      'endMedicalDate',
      'startMedicalDate',
    ],
  };
  disableAtt: { [key: string]: string[] } = {
    general: [
      'endMedicalDate',
      'startMedicalDate'
    ]
  }
  constructor(
    private insuranceSrv: InsuranceService,
    private attSrv: DynamicAttributeService,
    private msgSrv: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.pipe(
      switchMap(param => {
        this.emp.id = +param['id'];
        this.emp.name = param['name'];
        return insuranceSrv.getById(this.emp.id);
      })
    ).subscribe(res => {
      this.objs = {
        general: [
          {
            key: 'insuranceLife',
            label: 'Insurance Life',
            value: res.data.insuranceLife,
            dataType: 'bool',
            options: [],
            visible: true,
            command: (value, element, form) => {

            },
            required: true,
          },
          {
            key: 'insuranceMedical',
            label: 'Insurance Medical',
            value: res.data.insuranceMedical,
            dataType: 'bool',
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
          {
            key: 'startMedicalDate',
            label: 'Start Medical Date',
            value: res.data.startMedicalDate,
            dataType: 'datetime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'endMedicalDate',
            label: 'End Medical Date',
            value: res.data.endMedicalDate,
            dataType: 'datetime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'sendInsuranceDate',
            label: 'Send Insurance Date',
            value: res.data.sendInsuranceDate,
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
    if (this.objs && this.firstTime) {
      this.firstTime = false;
      console.log(this.formParent)
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
    body.startMedicalDate = this.attSrv.getStringDate(body.startMedicalDate)
    body.endMedicalDate = this.attSrv.getStringDate(body.endMedicalDate)
    body.sendInsuranceDate = this.attSrv.getStringDate(body.sendInsuranceDate)
    this.insuranceSrv.edit(body, this.emp.id).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.router.navigate(['admin/employee']);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
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
  insuranceMedicalCommand(value: any, element?: InputDynamic, form?: FormGroup, objs?: { [key: string]: InputDynamic[] }) {
    if (value === true) {
      form?.get('general.startMedicalDate')?.enable();
      form?.get('general.endMedicalDate')?.enable();
    } else if (value === false) {
      form?.get('general.endMedicalDate')?.disable();
      form?.get('general.startMedicalDate')?.disable();

    }
  }
}
