import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) { }
  showSuccess(summary: string, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
      sticky: false,
    });
  }

  showInfo(summary: string, detail: string) {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
      sticky: false,
    });
  }

  showWarn(summary: string, detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
      sticky: false,
    });
  }

  showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      sticky: false,
    });
  }

  showContrast(summary: string, detail: string) {
    this.messageService.add({
      severity: 'contrast',
      summary: summary,
      detail: detail,
      sticky: false,
    });
  }

  showSecondary(summary: string, detail: string) {
    this.messageService.add({
      severity: 'secondary',
      summary: summary,
      detail: detail,
      sticky: false,
    });
  }
}
