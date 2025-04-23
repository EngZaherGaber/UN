import { Component, Input } from '@angular/core';
import { PdfService } from '../../services/pdf.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Bill } from '../../interfaces/bill';

@Component({
  selector: 'bill-one-template',
  imports: [ToolbarModule, ButtonModule],
  templateUrl: './bill-one-template.component.html',
  styleUrl: './bill-one-template.component.scss'
})
export class BillOneTemplateComponent {
  @Input() data?: Bill;
  constructor(public pdfSrv: PdfService) { }
  downloadAsPDF() {
    this.pdfSrv.downloadAsPDF();
  }
  getBranch(str: string) {
    return str.split('/')[1];
  }
}
