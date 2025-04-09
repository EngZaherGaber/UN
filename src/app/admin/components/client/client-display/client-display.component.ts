import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { ToastService } from '../../../../general/services/toast.service';
import { ClientService } from '../../../services/client.service';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';

@Component({
  selector: 'client-display',
  imports: [DynmaicFormComponent],
  templateUrl: './client-display.component.html',
  styleUrl: './client-display.component.scss'
})
export class ClientDisplayComponent {
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
}
