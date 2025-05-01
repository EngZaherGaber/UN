import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PdfService } from '../../services/pdf.service';
import { CommonModule } from '@angular/common';
import { InvoiceItem } from '../../interfaces/invoice-item';
import { InvoiceService } from '../../../admin/services/invoice.service';

@Component({
  selector: 'invoice-template',
  imports: [ToolbarModule, ButtonModule, CommonModule],
  templateUrl: './invoice-template.component.html',
  styleUrl: './invoice-template.component.scss'
})
export class InvoiceTemplateComponent {
  @Input() invoice?: InvoiceItem;
  now: Date = new Date();
  contacts = [
    { title: 'Tel.: ', detail: '+963-11-4420567' },
    { title: 'Fax: ', detail: '+963-11-4430567' },
    { title: 'Mob: ', detail: '+963-94-4326650' },
    { title: 'P.O.Box: ', detail: '2121' },
  ]
  constructor(public pdfSrv: PdfService, private invoiceSrv: InvoiceService) { }

  downloadAsPDF() {
    if (this.invoice) {
      this.pdfSrv.downloadAsPDF();
      this.invoiceSrv.exportToExcel(
        this.invoice.employeeArray,
        `${this.pdfSrv.englishMonths[this.now.getMonth()] + this.invoice.poNumber}`
      );
    }
  }
  getEnglishMonth() {
    if (this.invoice) {
      return this.pdfSrv.englishMonths[this.now.getMonth()]
    }
    return ''
  }
}
