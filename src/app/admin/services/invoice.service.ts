import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../general/interfaces/response';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { TableLazyLoadEvent } from 'primeng/table';
import { Invoice } from '../../general/interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  url = environment.api + 'InvoiceManagment';
  constructor(private http: HttpClient) { }
  get(body: TableLazyLoadEvent) {
    return this.http.get<APIResponse<any>>(this.url);
  }
  getAllDetails(body: { poNumber: string, year: number, month: number }) {
    return this.http.post<APIResponse<Invoice[]>>(this.url + '/GetAllDetails', body);
  }
  exportToExcel(data: any[], fileName: string): void {
    // Calculate totals
    const totalPayableSalarySYP = data.reduce((sum, item) => sum + (item.payableSalarySYP || 0), 0);
    const totalTransportation = data.reduce((sum, item) => sum + (item.transportion || 0), 0);
    const totalMobile = data.reduce((sum, item) => sum + (item.mobile || 0), 0);
    const totalLaptop = data.reduce((sum, item) => sum + (item.laptop || 0), 0);
    const grandTotal = totalPayableSalarySYP + totalTransportation + totalMobile + totalLaptop;

    // Create worksheet data
    const wsData = [
      ['Pillar Team/13655616'],
      ['No.', 'Name in Arabic', 'Name in Latin', 'Salary USD', 'Payable Salary USD',
        'Payable Salary SYP', 'Transportation', 'Mobile', 'Laptop', 'Total', 'PO'],
      ...data.map((item, index) => [
        index + 1, item.arabicName, item.empName, item.salaryUsd,
        item.payableSalaryUsd, item.payableSalarySYP, item.transportion,
        item.mobile, item.laptop, item.total, item.po
      ]),
      ['Total', '', '', '', '', totalPayableSalarySYP, totalTransportation, totalMobile, totalLaptop, grandTotal, ''],
      ['IC&I Fees(10%)', '', '', '', '', totalPayableSalarySYP * 0.1, '', '', '', '', ''],
      ['Grand Total', '', '', '', '', (totalPayableSalarySYP * 0.1) + totalPayableSalarySYP, '', '', '', '', ''],
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Define styles
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: 'D3D3D3' } },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    const dataStyle = {
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    const numericStyle = {
      alignment: { horizontal: 'right', vertical: 'center' },
      numFmt: '#,##0',
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    // Apply styles
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;

        if (R === 0 || R === 1) {
          ws[cell_ref].s = headerStyle;
        } else if (R > 1 && R <= data.length + 1) {
          if (C >= 3 && C <= 9) {
            ws[cell_ref].s = numericStyle;
          } else {
            ws[cell_ref].s = dataStyle;
          }
        } else {
          if (C < 5) {
            ws[cell_ref].s = headerStyle;
          } else {
            ws[cell_ref].s = numericStyle;

          }
        }
      }
    }

    // Set column widths
    ws['!cols'] = [
      { wch: 5 }, { wch: 20 }, { wch: 20 }, { wch: 12 },
      { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 10 },
      { wch: 10 }, { wch: 18 }, { wch: 10 }
    ];

    // Merge cells
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
      { s: { r: data.length + 2, c: 0 }, e: { r: data.length + 2, c: 4 } },
      { s: { r: data.length + 3, c: 0 }, e: { r: data.length + 3, c: 4 } },
      { s: { r: data.length + 4, c: 0 }, e: { r: data.length + 4, c: 4 } },
    ];

    // Create workbook and save
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(data, fileName + '_' + new Date().getTime() + '.xlsx');
  }
}
