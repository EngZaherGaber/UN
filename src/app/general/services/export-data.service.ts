import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExportDataService {
  url: string =
    environment.api + '/api/Site/ExecuteStoredProcedureAndQueryDynamicView';
  constructor(private http: HttpClient) {}
  
}
