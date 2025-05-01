import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { APIResponse } from '../../../../general/interfaces/response';
import { ToastService } from '../../../../general/services/toast.service';
import { BankService } from '../../../services/bank.service';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { Bank } from '../../../../general/interfaces/bank';

@Component({
  selector: 'bank-edit',
  imports: [DynmaicFormComponent, CommonModule, FileUploadModule],
  templateUrl: './bank-edit.component.html',
  styleUrl: './bank-edit.component.scss'
})
export class BankEditComponent {
  @Input() banksId: number = 0;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  bank: Bank | null = null;
  objs: { [key: string]: InputDynamic[] } = {};
  file: File | null = null;
  showUploader: boolean = false;

  constructor(
    private bnkSrv: BankService,
    private msgSrv: ToastService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(param => {
        if (param['id']) {
          this.banksId = param['id'];
        }
        return this.bnkSrv.getById(this.banksId);
      })
    ).subscribe(async res => {
      this.bank = res.data;
      this.objs = {
        info: [
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
        image: [
        ],
      };
      this.file = await this.bnkSrv.pathToFileObject(res.data.bankLogoUrl, 'file');
    })
  }
  submit(event: any) {
    this.bnkSrv.edit(event, this.banksId, this.file).subscribe((res: APIResponse<any>) => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.close.emit(true)
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }

  onBasicUploadAuto(event: any) {
    this.file = event.files[0];
  }

  activeIndexChange(event: number) {
    this.showUploader = event === 1;
  }
}
