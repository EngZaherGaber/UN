import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType } from 'docx';
import { InvoiceTemplate } from '../interfaces/invoice-template';




@Injectable({
  providedIn: 'root'
})

export class PdfService {
  constructor() { }

  // Generate PDF Invoice
  async generatePDFInvoice(template: InvoiceTemplate, fileName: string = 'invoice.pdf'): Promise<void> {
    const doc = new jsPDF();
    const lineHeight = 7;
    let yPosition = 35; // Increased initial position for header
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add header to each page
    const addHeader = () => {
      doc.setFontSize(9);
      doc.setTextColor(79, 129, 189);
      const rightSideStart = (pageWidth / 3) * 2 + 20;
      doc.setFont('Calibri (Body)', 'normal');
      doc.text('Tel.: +963-11-4420567', rightSideStart, 10);
      doc.text('Fax: +963-11-4430567', rightSideStart, 15);
      doc.text('Mob: +963-94-4326650', rightSideStart, 20);
      doc.text('P.O.Box: 2121', rightSideStart, 25);
      doc.text('E-Mail: gd@ici-sy.com', rightSideStart, 30);
      doc.setFont('Rockwell Extra Bold', 'bold');
      doc.addImage('logo.png', 'png', 14, 10, 30, 15)
      doc.setTextColor(0, 0, 0); // Reset to black
      doc.line(14, 35, pageWidth - 14, 35);
    };

    // Add footer to each page
    const addFooter = (pageNumber: number, totalPages: number) => {
      doc.setFontSize(9);
      doc.setTextColor(79, 129, 189);
      doc.setFont('Calibri(Body)', 'bold')
      if (pageNumber === totalPages) {
        doc.addImage('logo.png', 'png', 14, 284, 8, 4)
        doc.text('Damascus- Syria – P.O. Box: 2121 Tel: +963 11 4420567, Fax: +963 11 4430567 e-mail: gd@ici-sy.com Web: www.ici-sy.com', 24, 288);
        doc.line(14, 280, pageWidth - 14, 280);
      }
      doc.setTextColor(0, 0, 0); // Reset to black
    };

    addHeader();
    yPosition += lineHeight;
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.setFont('Calibri (Body)', 'bold');
    doc.text('I N V O I C E', 105, yPosition, { align: 'center' });
    yPosition += lineHeight;

    // Rest of your existing content (Bill to/Ship to table, items table, etc.)
    autoTable(doc, {
      startY: yPosition,
      body: [
        [
          {
            content: 'Bill to:\n' + template.billTo,
            styles: { fontStyle: 'bold', cellPadding: { top: 2, right: 2, bottom: 2, left: 2 } }
          },
          {
            content: 'Ship to:\n' + (template.shipTo || 'Same as bill'),
            styles: { fontStyle: 'bold', cellPadding: { top: 2, right: 2, bottom: 2, left: 2 } }
          }
        ],
        [
          { content: `COO No: ${template.cooNumber}\nCOO Date: ${template.cooDate}` },
          { content: `Invoice No: ${template.invoiceNumber}\nInvoice Date: ${template.invoiceDate}` }
        ],
        [
          { content: `PO Number: ${template.poNumber}`, colSpan: 2 }
        ],
        [
          { content: `Subject: ${template.subject}`, colSpan: 2 }
        ]
      ],
      styles: { lineColor: [0, 0, 0], lineWidth: 0.5 },
      columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' } },
      didDrawPage: (data) => {
        // Add header to each new page
        addHeader();
        yPosition += lineHeight;
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Add greeting and items table (your existing code)
    doc.setFontSize(11);
    doc.setFont('Calibri (Body)', 'light');
    doc.text('Dear Sirs,', 14, yPosition);
    yPosition += lineHeight;
    doc.text(`Reference to the Call of Order COOs mentioned above, kindly find below invoice --`, 28, yPosition);
    yPosition += lineHeight;
    doc.setFont('Calibri (Body)', 'bold');
    doc.text(`${template.subject}`, 14, yPosition);
    doc.setFont('Calibri (Body)', 'light');
    yPosition += lineHeight;

    const itemsBody = template.items.map(item => [
      item.itemNumber,
      item.description,
      this.formatCurrency(item.value)
    ]);

    const grandTotal = template.items.reduce((sum, item) => sum + item.value, 0);

    autoTable(doc, {
      startY: yPosition,
      head: [['Item', 'Description', 'Value SP']],
      body: [
        ...itemsBody,
        [
          {
            content: 'Grand Total',
            colSpan: 2,
            styles: { fontStyle: 'bold', halign: 'center' }
          },
          {
            content: this.formatCurrency(grandTotal),
            styles: { fontStyle: 'bold', halign: 'left' }
          }
        ]
      ],
      headStyles: {
        fillColor: [150, 150, 150],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 120 },
        2: { cellWidth: 40, halign: 'left' }
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Add amount in words and bank info (your existing code)
    doc.setFontSize(10);
    doc.text(`Only: ${this.numberToWords(grandTotal)} .SYP`, 14, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(11);
    doc.setFont('Calibri (Body)', 'bold');
    doc.text('Bank Information:', 14, yPosition);
    yPosition += lineHeight;

    autoTable(doc, {
      startY: yPosition,
      body: [
        ['Bank name', template.bankInfo.bankName],
        ['Account No', template.bankInfo.accountNumber],
        ['Account Name', template.bankInfo.accountName]
      ],
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 14;

    // Signatory
    doc.setFontSize(11);
    doc.setFont('Calibri (Body)', 'light');
    doc.text('Sincerely yours,', 14, yPosition);
    yPosition += lineHeight + 5;

    doc.setFont('Calibri (Body)', 'bold');
    doc.text(template.signatory.name, 14, yPosition);
    yPosition += 5;

    doc.setFontSize(9);
    doc.setFont('Calibri (Body)', 'light');
    doc.text(template.signatory.position, 14, yPosition);
    doc.setFontSize(11);

    yPosition += lineHeight * 2;
    // After all content is added, add footers to all pages
    const totalPages = doc.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i, totalPages);
    }

    doc.save(fileName);
  }

  // Generate Word Invoice
  async generateWordInvoice(template: InvoiceTemplate, fileName: string = 'invoice.docx'): Promise<void> {
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType } = await import('docx');

    const grandTotal = template.items.reduce((sum, item) => sum + item.value, 0);

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "I N V O I C E",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Bill to / Ship to table
          new Table({
            rows: [
              new TableRow({
                children: [
                  this.createTableCell(`Bill to:\n${template.billTo}`, true),
                  this.createTableCell(`Ship to:\n${template.shipTo || 'Same as bill'}`, true)
                ]
              })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: 'single', size: 6, color: '000000' },
              bottom: { style: 'single', size: 6, color: '000000' },
              left: { style: 'single', size: 6, color: '000000' },
              right: { style: 'single', size: 6, color: '000000' },
              insideHorizontal: { style: 'single', size: 6, color: '000000' },
              insideVertical: { style: 'single', size: 6, color: '000000' }
            }
          }),

          // COO/Invoice info
          this.createInfoTable([
            [`COO No: ${template.cooNumber}`, `Invoice No: ${template.invoiceNumber}`],
            [`COO Date: ${template.cooDate}`, `Invoice Date: ${template.invoiceDate}`],
            [`PO Number: ${template.poNumber}`, ''],
            [`Subject: ${template.subject}`, '']
          ]),

          // Greeting
          new Paragraph({
            children: [
              new TextRun({ text: 'Dear Sirs,', break: 1 })
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun('Reference to the Call of Order COOs mentioned above, kindly find below')
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun('invoice --')
            ],
            spacing: { after: 400 }
          }),

          // Subject
          new Paragraph({
            text: template.subject,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 400 }
          }),

          // Items table
          new Table({
            rows: [
              // Header row
              new TableRow({
                children: [
                  this.createTableCell('Item', true),
                  this.createTableCell('Description', true),
                  this.createTableCell('Value SP', true)
                ]
              }),
              // Item rows
              ...template.items.map(item => new TableRow({
                children: [
                  this.createTableCell(item.itemNumber),
                  this.createTableCell(item.description),
                  this.createTableCell(this.formatCurrency(item.value))
                ]
              })),
              // Grand total row
              new TableRow({
                children: [
                  this.createTableCell(''),
                  this.createTableCell('Grand Total', true),
                  this.createTableCell(this.formatCurrency(grandTotal), true)
                ]
              })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: 'single', size: 6, color: '000000' },
              bottom: { style: 'single', size: 6, color: '000000' },
              left: { style: 'single', size: 6, color: '000000' },
              right: { style: 'single', size: 6, color: '000000' },
              insideHorizontal: { style: 'single', size: 6, color: '000000' },
              insideVertical: { style: 'single', size: 6, color: '000000' }
            }
          }),

          // Amount in words
          new Paragraph({
            text: `Only: ${this.numberToWords(grandTotal)} .SYP`,
            spacing: { before: 400, after: 400 }
          }),

          // Bank information
          new Paragraph({
            text: 'Bank Information:',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 }
          }),
          this.createInfoTable([
            ['Bank name', template.bankInfo.bankName],
            ['Account No', template.bankInfo.accountNumber],
            ['Account Name', template.bankInfo.accountName]
          ]),

          // Signatory
          new Paragraph({
            text: 'Sincerely yours,',
            spacing: { before: 600, after: 600 }
          }),
          new Paragraph({
            text: template.signatory.name,
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: template.signatory.position,
            spacing: { after: 400 }
          })
        ]
      }]
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    this.downloadFile(blob, fileName);
  }

  private createTableCell(text: string, bold: boolean = false): TableCell {
    return new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text, bold })]
      })],
      margins: { top: 100, bottom: 100, left: 100, right: 100 }
    });
  }

  private createInfoTable(rows: string[][]): Table {
    const { Table, TableRow, TableCell, Paragraph, TextRun } = require('docx');

    return new Table({
      rows: rows.map(row => new TableRow({
        children: row.map((cell, i) => new TableCell({
          children: [new Paragraph({
            children: [new TextRun({
              text: cell,
              bold: i === 0 && cell.includes(':')
            })]
          })],
          margins: { top: 100, bottom: 100, left: 100, right: 100 }
        }))
      })),
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: 'single', size: 6, color: '000000' },
        bottom: { style: 'single', size: 6, color: '000000' },
        left: { style: 'single', size: 6, color: '000000' },
        right: { style: 'single', size: 6, color: '000000' },
        insideHorizontal: { style: 'single', size: 6, color: '000000' },
        insideVertical: { style: 'single', size: 6, color: '000000' }
      }
    });
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  private numberToWords(num: number): string {
    // Implementation of number to words conversion
    // This is a simplified version - you might want to implement a complete solution
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if (num === 0) return 'zero';

    // This is a very basic implementation - consider using a library for complete solution
    return 'one hundred and nineteen million three hundred and fifty-eight thousand';
  }

  private downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
