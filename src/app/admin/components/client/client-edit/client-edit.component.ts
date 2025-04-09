import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { ClientService } from '../../../services/client.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { switchMap } from 'rxjs';
import { Client } from '../../../../general/interfaces/client';

@Component({
  selector: 'client-edit',
  imports: [DynmaicFormComponent],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  @Input() clientId: number = 0;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  constructor(private route: ActivatedRoute, private clntSrv: ClientService, private msgSrv: ToastService, private router: Router) {
  }
  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(param => {
          if (param['id']) {
            return this.clntSrv.getById(+param['id'])
          } else {
            return this.clntSrv.getById(this.clientId)
          }
        })
      )
      .subscribe(res => {
        this.objs = {
          general: [
            {
              key: 'clientName',
              label: 'Client Name',
              value: res.data.clientName,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'clientId',
              label: 'Client Name',
              value: res.data.clientId,
              dataType: 'string',
              options: [],
              visible: false,
              command: (value, element, form) => { },
              required: true,
            },
          ],
        };
      })
  }
  submit(event: any) {
    this.clntSrv.edit(event, this.clientId).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.close.emit(true)
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
