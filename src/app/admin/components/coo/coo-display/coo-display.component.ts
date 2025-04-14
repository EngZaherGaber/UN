import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, forkJoin } from 'rxjs';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { Client } from '../../../../general/interfaces/client';
import { Currency } from '../../../../general/interfaces/currency';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { ToastService } from '../../../../general/services/toast.service';
import { ClientService } from '../../../services/client.service';
import { CooService } from '../../../services/coo.service';
import { CurrencyService } from '../../../services/currency.service';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';

@Component({
  selector: 'app-coo-display',
  imports: [AdTemplateComponent, DynmaicFormComponent],
  templateUrl: './coo-display.component.html',
  styleUrl: './coo-display.component.scss'
})
export class CooDisplayComponent {
  objs: { [key: string]: InputDynamic[] } = {};
  clients: Client[] = [];
  currencies: Currency[] = [];
  cooId: number = 0;
  constructor(
    private cooSrv: CooService,
    private msgSrv: ToastService,
    private router: Router,
    clntSrv: ClientService,
    currencySrv: CurrencyService,
    route: ActivatedRoute
  ) {
    route.params.pipe(
      switchMap(param => {
        this.cooId = +param['id'];
        return forkJoin({ clients: clntSrv.getAll(), currencies: currencySrv.getAll() })
      })
    )
      .pipe(
        switchMap(res => {
          this.clients = res.clients['data']
          this.currencies = res.currencies['data']
          return cooSrv.getById(this.cooId ?? 0);
        })
      )
      .subscribe(res => {
        this.objs = {
          general: [
            {
              key: 'cooNumber',
              label: 'COO No.',
              value: res.data.cooNumber,
              dataType: 'string',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'cooDate',
              label: 'COO Date',
              value: res.data.cooDate,
              dataType: 'DateTime',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'totalValue',
              label: 'Total Value',
              value: res.data.totalValue,
              dataType: 'int',
              options: [],
              visible: true,
              command: (value, element, form) => { },
              required: true,
            },
            {
              key: 'currencyId',
              label: 'Currency',
              value: res.data.currencyId,
              dataType: 'list',
              options: this.currencies.map((currency) => {
                return { id: currency.id, name: currency.type }
              }),
              visible: true,
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
            {
              key: 'poNumber',
              label: 'PO Number',
              value: res.data.poNumber,
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
