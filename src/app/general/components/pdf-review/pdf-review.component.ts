import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'pdf-review',
  imports: [ToolbarModule, ButtonModule],
  templateUrl: './pdf-review.component.html',
  styleUrl: './pdf-review.component.scss'
})
export class PdfReviewComponent {
  constructor(private pdfSrv: PdfService) { }
  download() {
    const data = document.getElementById('contentToConvert');
    if (data)
      html2canvas(data).then(canvas => {
        this.pdfSrv.downloadHtmlCanvasElement(canvas)
      });
  }
}
