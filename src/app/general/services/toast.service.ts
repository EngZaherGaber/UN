import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}
  showSuccess(summary: string, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
      sticky: true,
    });
  }

  showInfo(summary: string, detail: string) {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
      sticky: true,
    });
  }

  showWarn(summary: string, detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
      sticky: true,
    });
  }

  showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      sticky: true,
    });
  }

  showContrast(summary: string, detail: string) {
    this.messageService.add({
      severity: 'contrast',
      summary: summary,
      detail: detail,
      sticky: true,
    });
  }

  showSecondary(summary: string, detail: string) {
    this.messageService.add({
      severity: 'secondary',
      summary: summary,
      detail: detail,
      sticky: true,
    });
  }
}
