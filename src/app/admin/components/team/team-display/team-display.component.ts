import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { Client } from '../../../../general/interfaces/client';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { ClientService } from '../../../services/client.service';
import { TeamService } from '../../../services/team.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';

@Component({
  selector: 'app-team-display',
  imports: [AdTemplateComponent, DynmaicFormComponent],
  templateUrl: './team-display.component.html',
  styleUrl: './team-display.component.scss'
})
export class TeamDisplayComponent {
objs: { [key: string]: InputDynamic[] } = {};
  clients: Client[] = [];
  teamId: number = 0;
  constructor(
    private teamSrv: TeamService,
    private msgSrv: ToastService,
    private router: Router,
    clntSrv: ClientService,
    route: ActivatedRoute
  ) {
    route.params.pipe(
      switchMap(param => {
        this.teamId = +param['id'];
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
}
