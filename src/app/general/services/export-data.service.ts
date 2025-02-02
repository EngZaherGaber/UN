import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportDataService {
  url: string =
    environment.api + '/api/Site/ExecuteStoredProcedureAndQueryDynamicView';
  constructor(private http: HttpClient) {}
  exportExcel(jsonData: any[], fileName: string): void {
    const filterData = jsonData.map(({ buttons, ...rest }) => {
      const seenKeys = new Set<string>();
      return Object.keys(rest).reduce((acc, key) => {
        const lowerCaseKey = key.toLowerCase();
        if (!seenKeys.has(lowerCaseKey)) {
          seenKeys.add(lowerCaseKey);
          acc[key] = rest[key];
        }
        return acc;
      }, {} as { [key: string]: any });
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filterData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
