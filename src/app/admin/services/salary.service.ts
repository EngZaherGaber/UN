import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../general/interfaces/response';
import { Salary } from '../../general/interfaces/salary';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  url = environment.api + 'SalaryManagment';
  constructor(private http: HttpClient) { }
  getAll(body: TableLazyLoadEvent, empId: number) {
    return this.http.post<APIResponse<any[]>>(this.url + '/GetAll/' + empId, body);
  }
  calculate(body: Salary) {
    return this.http.put<APIResponse<any>>(this.url + '/CalculateSalary', body);
  }
}
