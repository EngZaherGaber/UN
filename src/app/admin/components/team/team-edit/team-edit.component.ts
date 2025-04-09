import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { ClientService } from '../../../services/client.service';
import { TeamService } from '../../../services/team.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { Client } from '../../../../general/interfaces/client';
import { switchMap } from 'rxjs';

@Component({
  selector: 'team-edit',
  imports: [DynmaicFormComponent],
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.scss'
})
export class TeamEditComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  clients: Client[] = [];
  @Input() teamId: number = 0;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private teamSrv: TeamService,
    private msgSrv: ToastService,
    private router: Router,
    clntSrv: ClientService,
    route: ActivatedRoute
  ) {
    route.params.pipe(
      switchMap(param => {
        if (this.teamId) {
          this.teamId = +param['id'];
        }
        return clntSrv.getAll();
      })
    )
      .pipe(
        switchMap(param => {
          this.clients = param['data']
          return teamSrv.getById(this.teamId ?? 0);
        })
      )
      .subscribe(res => {
        this.objs = {
          general: [
            {
              key: 'teamName',
              label: 'Team Name',
              value: res.data.teamName,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'teamId',
              label: 'Team Name',
              value: res.data.teamId,
              dataType: 'string',
              options: [],
              visible: false,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'clientId',
              label: 'Client Name',
              value: res.data.clientId,
              dataType: 'list',
              options: this.clients.map(client => {
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
    this.teamSrv.edit(event, this.teamId).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.close.emit(true);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
