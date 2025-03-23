import { Component } from '@angular/core';
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
  selector: 'app-client-edit',
  imports: [AdTemplateComponent, DynmaicFormComponent],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  clientId: number = 0;
  constructor(route: ActivatedRoute, private clntSrv: ClientService, private msgSrv: ToastService, private router: Router) {
    route.params
      .pipe(
        switchMap(param => {
          this.clientId = +param['id'];
          return this.clntSrv.getById(this.clientId)
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
    this.clntSrv.edit(event.general, this.clientId).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.router.navigate(['admin/client']);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
