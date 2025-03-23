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

@Component({
  selector: 'app-ad-team-general',
  imports: [AdTemplateComponent, DynamicTableComponent],
  templateUrl: './ad-team-general.component.html',
  styleUrl: './ad-team-general.component.scss'
})
export class AdTeamGeneralComponent {
  info: InfoTable;
  columnsEvent = [
    {
      field: 'isStudent',
    },
  ]
  addFunc: () => void = () => {
    this.router.navigate(['admin/team/add'])
  }
  deleteFunc: (rowData: any) => void = (rowData) => {
    this.confirm.deleteConfirm((obj) => {
      this.teamSrv.delete(obj).subscribe(res => {
        this.msgSrv.showWarn('Success!', 'Team Deleted');
        this.info.getSub$.next({})
      });
    }, rowData.teamId)
  }
  editFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/team/edit/' + rowData.teamId])
  }
  displayFunc: (rowData: any) => void = (rowData) => {
    this.router.navigate(['admin/team/display/' + rowData.teamId])
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
                        dataType: 'int',
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
      ['isStudent']
    );
    this.info.getSub$.next(true);
  }
}
