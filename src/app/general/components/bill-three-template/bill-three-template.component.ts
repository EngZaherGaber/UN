import { Component, Input } from '@angular/core';
import { PdfService } from '../../services/pdf.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Bill } from '../../interfaces/bill';

@Component({
  selector: 'bill-three-template',
  imports: [ToolbarModule, ButtonModule],
  templateUrl: './bill-three-template.component.html',
  styleUrl: './bill-three-template.component.scss'
})
export class BillThreeTemplateComponent {
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
