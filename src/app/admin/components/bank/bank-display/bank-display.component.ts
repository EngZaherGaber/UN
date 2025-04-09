import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { BankService } from '../../../services/bank.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'bank-display',
  imports: [DynmaicFormComponent],
  templateUrl: './bank-display.component.html',
  styleUrl: './bank-display.component.scss'
})
export class BankDisplayComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  @Input() banksId: number = 0;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private bnkSrv: BankService,
    private msgSrv: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }
  ngOnInit() {
    this.route.params.pipe(
      switchMap(param => {
        if (param['id']) {
          this.banksId = param['id'];
        }
        return this.bnkSrv.getById(this.banksId);
      })
    ).subscribe(res => {
      this.objs = {
        general: [
          {
            key: 'banksName',
            label: 'Bank Name',
            value: res.data.banksName,
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
