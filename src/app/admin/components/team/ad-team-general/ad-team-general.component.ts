import { Component } from '@angular/core';
import { TeamService } from '../../../services/team.service';
import { Router } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ToastService } from '../../../../general/services/toast.service';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { TeamAddComponent } from '../team-add/team-add.component';
import { TeamEditComponent } from '../team-edit/team-edit.component';
import { TeamDisplayComponent } from '../team-display/team-display.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Team } from '../../../../general/interfaces/team';

@Component({
  selector: 'ad-team-general',
  imports: [
    DynamicTableComponent,
    TeamAddComponent,
    TeamEditComponent,
    TeamDisplayComponent,
    DialogModule,
    CommonModule
  ],
  templateUrl: './ad-team-general.component.html',
  styleUrl: './ad-team-general.component.scss'
})
export class AdTeamGeneralComponent {
  info: InfoTable;
  addDialog: boolean = false;
  editDialog: boolean = false;
  displayDialog: boolean = false;
  editTeamId: number = 0;
  displayTeamId: number = 0;

  addFunc: () => void = () => {
    this.addDialog = true;
  }
  editFunc: (rowData: Team) => void = (rowData: Team) => {
    this.editTeamId = rowData.teamId ?? 0;
    this.editDialog = true;
  }
  displayFunc: (rowData: Team) => void = (rowData: Team) => {
    this.displayTeamId = rowData.teamId ?? 0;
    this.displayDialog = true;
  }
  deleteFunc: (rowData: any) => void = (rowData) => {
    this.confirm.deleteConfirm((obj) => {
      this.teamSrv.delete(obj).subscribe(res => {
        this.msgSrv.showSuccess('Success!', 'Team Deleted');
        this.info.getSub$.next(true)
      });
    }, rowData.teamId)
  }
  constructor(
    private msgSrv: ToastService,
    private tblSrv: DyTableService,
    private router: Router,
    private teamSrv: TeamService,
    private confirm: ConfirmService,
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.editFunc, this.displayFunc, this.addFunc)
  }
  ngOnInit(): void {
    this.info.get$ = this.tblSrv.getLibObs(
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body === true) {
            return this.teamSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: {
                    model: res.data,
                    type: [
                      {
                        attribute: 'teamName',
                        dynamic: null,
                        dataType: 'string',
                      },
                      {
                        attribute: 'clientName',
                        dynamic: null,
                        dataType: 'string',
                      },
                    ],
                  },
                });
              })
            )
          } else {
            return of({
              loading: false,
              data: [],
              columns: [],
            });
          }
        })
      ),
      ['Id', 'Deleted'],
      []
    );
    this.info.getSub$.next(true);
  }
}
