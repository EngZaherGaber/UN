import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PdfService } from '../../../general/services/pdf.service';
import { InvoiceTemplate } from '../../../general/interfaces/invoice-template';

@Component({
  selector: 'app-invoice',
  imports: [ButtonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {
  constructor(private pdfSrv: PdfService) { }
  async generate() {
    const template: InvoiceTemplate = {
      invoiceNumber: 'UNDP-00228-2025',
      invoiceDate: '03/26/2025',
      cooNumber: 'UNDP 066-ICI-25',
      cooDate: '30-1-2025',
      poNumber: '10349125',
      subject: 'All Outcomes Salary February 2025',
      billTo: 'UNDP-Syria.\nProcurement Unit\nDamascus, Syria',
      items: [
        { itemNumber: '1', description: 'All Outcomes Salary February 2025', value: 104280000 },
        { itemNumber: '2', description: 'IC&I Fees', value: 10428000 },
        { itemNumber: '3', description: 'Laptop rent', value: 0 },
        { itemNumber: '4', description: 'Laptop Paid', value: 800000 },
        { itemNumber: '5', description: 'Transportation', value: 3600000 },
        { itemNumber: '6', description: 'Mobile', value: 250000 }
      ],
      bankInfo: {
        bankName: 'Syrian Commercial Bank - Branch 18',
        accountNumber: '0118-275611-001',
        accountName: 'Omar Fallouh Foundation Information Consultancies'
      },
      signatory: {
        name: 'Omar Fallouh',
        position: 'General Manager'
      }
    };
    const pdf = await this.pdfSrv.generatePDFInvoice(template, 'x');
    // const url = window.URL.createObjectURL(pdf);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'x';

    // // Append to body, click and remove
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);

    // // Release the object URL
    // window.URL.revokeObjectURL(url);
  }
}
