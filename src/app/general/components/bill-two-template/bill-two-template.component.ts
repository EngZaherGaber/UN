import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PdfService } from '../../services/pdf.service';
import { Bill } from '../../interfaces/bill';

@Component({
  selector: 'bill-two-template',
  imports: [ToolbarModule, ButtonModule],
  templateUrl: './bill-two-template.component.html',
  styleUrl: './bill-two-template.component.scss'
})
export class BillTwoTemplateComponent {
  @Input() data?: Bill;
  constructor(public pdfSrv: PdfService) { }
  downloadAsPDF() {
    this.pdfSrv.downloadAsPDF();
  }
  getfrag(num: string, start: number, end?: number) {
    return num.slice(start, end);
  }
  getBranch(str: string) {
    return str.split('/')[1];
  }
}
