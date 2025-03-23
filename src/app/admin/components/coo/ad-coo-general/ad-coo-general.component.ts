import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ToastService } from '../../../../general/services/toast.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { CooService } from '../../../services/coo.service';
import { COO } from '../../../../general/interfaces/coo';

@Component({
  selector: 'app-ad-coo-general',
  imports: [AdTemplateComponent, DynamicTableComponent],
  templateUrl: './ad-coo-general.component.html',
  styleUrl: './ad-coo-general.component.scss'
})
export class AdCooGeneralComponent {
  info: InfoTable;
  addFunc: () => void = () => {
    this.router.navigate(['admin/coo/add'])
  }
  deleteFunc: (rowData: COO) => void = (rowData) => {
    this.confirm.deleteConfirm((obj) => {
      this.cooSrv.delete(obj).subscribe(res => {
        this.msgSrv.showWarn('Success!', 'COO Deleted');
        this.info.getSub$.next(true)
      });
    }, rowData.cooId)
  }
  editFunc: (rowData: COO) => void = (rowData) => {
    this.router.navigate(['admin/coo/edit/' + rowData.cooId])
  }
  displayFunc: (rowData: COO) => void = (rowData) => {
    this.router.navigate(['admin/coo/display/' + rowData.cooId])
  }

  constructor(
    private msgSrv: ToastService,
    private tblSrv: DyTableService,
    private router: Router,
    private cooSrv: CooService,
    private confirm: ConfirmService
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.editFunc, this.displayFunc, this.addFunc)
  }
  ngOnInit(): void {
    this.info.get$ = this.tblSrv.getLibObs(
      this.info.getSub$.pipe(
        switchMap((body: any) => {
          if (body === true) {
            return this.cooSrv.getAll().pipe(
              switchMap(res => {
                return of({
                  data: {
                    model: res.data,
                    type: [
                      {
                        attribute: 'cooNumber',
                        dynamic: null,
                        dataType: 'string',
                      },
                      {
                        attribute: 'cooDate',
                        dynamic: null,
                        dataType: 'dateTime',
                      },
                      {
                        attribute: 'totalValue',
                        dynamic: null,
                        dataType: 'int',
                      },
                      {
                        attribute: 'clientName',
                        dynamic: null,
                        dataType: 'string',
                      },
                      {
                        attribute: 'currencyType',
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
      ['isStudent']
    );
    this.info.getSub$.next(true);
  }
}
