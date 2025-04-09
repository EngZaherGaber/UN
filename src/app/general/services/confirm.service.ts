import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(private confirm: ConfirmationService) { }
  deleteConfirm(func: (obj: any) => void, inpt: any, message?: string) {
    message = message ?? 'Are You Need to Delete This Item ?'
    this.confirm.confirm({
      message: message,
      closable: true,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        func(inpt);
      }
    })
  }
  disableConfirm(func: (obj: any) => void, inpt: any) {
    this.confirm.confirm({
      message: 'Are You Need to Change Status This Item?',
      closable: true,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        func(inpt);
      }
    })
  }
}
