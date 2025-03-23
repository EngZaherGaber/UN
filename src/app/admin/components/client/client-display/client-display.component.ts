import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { ClientService } from '../../../services/client.service';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';

@Component({
  selector: 'app-client-display',
  imports: [DynmaicFormComponent, AdTemplateComponent],
  templateUrl: './client-display.component.html',
  styleUrl: './client-display.component.scss'
})
export class ClientDisplayComponent {
objs: { [key: string]: InputDynamic[] } = {};
  constructor(route: ActivatedRoute, private clntSrv: ClientService, private msgSrv: ToastService, private router: Router) {
    route.params
      .pipe(
        switchMap(param => {
          return this.clntSrv.getById(+param['id'])
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
          ],
        };
      })
  }

}
