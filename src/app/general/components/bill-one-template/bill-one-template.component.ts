import { Component, Input } from '@angular/core';
import { PdfService } from '../../services/pdf.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bill-one-template',
  imports: [ToolbarModule, ButtonModule],
  templateUrl: './bill-one-template.component.html',
  styleUrl: './bill-one-template.component.scss'
})
export class BillOneTemplateComponent {
  @Input() data: any;
  constructor(public pdfSrv: PdfService) { }
  downloadAsPDF() {
    this.pdfSrv.downloadAsPDF();
  }
}
