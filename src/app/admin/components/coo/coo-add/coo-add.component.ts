import { Component } from '@angular/core';
import { CooService } from '../../../services/coo.service';
import { Router } from '@angular/router';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { ClientService } from '../../../services/client.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { forkJoin } from 'rxjs';
import { CurrencyService } from '../../../services/currency.service';

@Component({
  selector: 'app-coo-add',
  imports: [AdTemplateComponent, DynmaicFormComponent],
  templateUrl: './coo-add.component.html',
  styleUrl: './coo-add.component.scss'
})
export class CooAddComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  constructor(
    private cooSrv: CooService,
    private msgSrv: ToastService,
    private router: Router,
    clntSrv: ClientService,
    currencySrv: CurrencyService
  ) {
    forkJoin({ clients: clntSrv.getAll(), currencies: currencySrv.getAll() }).subscribe(res => {
      this.objs = {
        general: [
          {
            key: 'cooNumber',
            label: 'COO No.',
            value: null,
            dataType: 'string',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'cooDate',
            label: 'COO Date',
            value: null,
            dataType: 'DateTime',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'totalValue',
            label: 'Total Value',
            value: null,
            dataType: 'int',
            options: [],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'currencyId',
            label: 'Currency',
            value: null,
            dataType: 'list',
            options: res.currencies.data.map((currency) => {
              return { id: currency.id, name: currency.type }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'clientId',
            label: 'Client Name',
            value: null,
            dataType: 'list',
            options: res.clients.data.map(client => {
              return { id: client.clientId, name: client.clientName }
            }),
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
          {
            key: 'poNumber',
            label: 'PO Number',
            value: null,
            dataType: 'string',
            options:[],
            visible: true,
            command: (value, element, form) => { },
            required: true,
          },
        ],
      };
    })

  }
  submit(event: any) {
    this.cooSrv.add(event).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.router.navigate(['admin/coo']);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
