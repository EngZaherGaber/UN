import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { BankService } from '../../../services/bank.service';

@Component({
  selector: 'bank-add',
  imports: [DynmaicFormComponent],
  templateUrl: './bank-add.component.html',
  styleUrl: './bank-add.component.scss'
})
export class BankAddComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  constructor(private bnkSrv: BankService, private msgSrv: ToastService, private router: Router) {
    this.objs = {
      general: [
        {
          key: 'banksName',
          label: 'Bank Name',
          value: null,
          dataType: 'string',
          options: [],
          visible: true,
          command: (value, element, form) => { },
          required: true,
        },
      ],
    };
  }
  submit(event: any) {
    this.bnkSrv.add(event).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.close.emit(true)
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
