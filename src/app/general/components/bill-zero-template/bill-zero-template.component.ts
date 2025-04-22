import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PdfService } from '../../services/pdf.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'bill-zero-template',
  imports: [CommonModule, ToolbarModule, ButtonModule],
  templateUrl: './bill-zero-template.component.html',
  styleUrl: './bill-zero-template.component.scss'
})
export class BillZeroTemplateComponent {
  contacts = [
    { title: 'Tel.: ', detail: '+963-11-4420567' },
    { title: 'Fax: ', detail: '+963-11-4430567' },
    { title: 'Mob: ', detail: '+963-94-4326650' },
    { title: 'P.O.Box: ', detail: '2121' },
  ]
  @Input() data: any;
  constructor(public pdfSrv: PdfService) { }
  downloadAsPDF() {
    this.pdfSrv.downloadAsPDF();
  }
}
