import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { BankService } from '../../../services/bank.service';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bank-add',
  imports: [DynmaicFormComponent, FileUploadModule, CommonModule, ButtonModule],
  templateUrl: './bank-add.component.html',
  styleUrl: './bank-add.component.scss'
})
export class BankAddComponent {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  objs: { [key: string]: InputDynamic[] } = {};
  file: any;
  showUploader: boolean = false;

  constructor(private bnkSrv: BankService, private msgSrv: ToastService, private router: Router) {
    this.objs = {
      info: [
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
      image: [
      ],
    };
  }

  submit(event: any) {
    this.bnkSrv.add(event, this.file).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.close.emit(true)
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
  onBasicUploadAuto(event: any) {
    console.log(event);
    this.file = event.files[0];
  }

  activeIndexChange(event: number) {
    this.showUploader = event === 1;
  }
}
