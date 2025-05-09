import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../general/interfaces/response';
import { SalaryCreate } from '../../general/interfaces/salary-create';
import { TableLazyLoadEvent } from 'primeng/table';
import { DSA } from '../../general/interfaces/dsa';
import { Salary } from '../../general/interfaces/salary';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  url = environment.api + 'SalaryManagment';
  constructor(private http: HttpClient) { }
  getAll(body: TableLazyLoadEvent, empId: number) {
    return this.http.post<APIResponse<any[]>>(this.url + '/GetAll/' + empId, body);
  }
  getById(salaryId: number) {
    return this.http.get<APIResponse<Salary>>(this.url + '/' + salaryId);
  }
  calculate(body: SalaryCreate) {
    return this.http.put<APIResponse<any>>(this.url + '/CalculateSalary', body);
  }
  getAllDSA(body: TableLazyLoadEvent, empId: number) {
    return this.http.post<APIResponse<any>>(this.url + '/GetAllDsaByEmployeeId/' + empId, body);
  }
  addDSA(body: DSA) {
    return this.http.post<APIResponse<any>>(this.url + '/AddDsa', body);
  }
}
