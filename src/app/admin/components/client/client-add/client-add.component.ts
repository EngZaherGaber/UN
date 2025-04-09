import { Component, EventEmitter, Output } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Router } from '@angular/router';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';

@Component({
  selector: 'client-add',
  imports: [DynmaicFormComponent],
  templateUrl: './client-add.component.html',
  styleUrl: './client-add.component.scss'
})
export class ClientAddComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  constructor(private clntSrv: ClientService, private msgSrv: ToastService, private router: Router) {
    this.objs = {
      general: [
        {
          key: 'clientName',
          label: 'Client Name',
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
    this.clntSrv.add(event).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.close.emit(true)
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
