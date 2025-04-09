import { Component, EventEmitter, Output } from '@angular/core';
import { TeamService } from '../../../services/team.service';
import { Router } from '@angular/router';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'team-add',
  imports: [DynmaicFormComponent],
  templateUrl: './team-add.component.html',
  styleUrl: './team-add.component.scss'
})
export class TeamAddComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private teamSrv: TeamService,
    private msgSrv: ToastService,
    private router: Router,
    private clntSrv: ClientService
  ) {
    this.clntSrv.getAll().subscribe(res => {
      this.objs = {
        general: [
          {
            key: 'teamName',
            label: 'Team Name',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'clientId',
            label: 'Client Name',
            value: null,
            dataType: 'list',
            options: (res.data as any[]).map(client => {
              return { id: client.clientId, name: client.clientName }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
        ],
      };
    })

  }
  submit(event: any) {
    this.teamSrv.add(event).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.close.emit(true);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
