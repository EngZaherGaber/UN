import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../general/interfaces/response';
import { Employee } from '../../general/interfaces/employee';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url = environment.api + 'UnEmployeeManagment';
  constructor(private http: HttpClient) { }
  getAll(body: TableLazyLoadEvent) {
    return this.http.post<APIResponse<Employee[]>>(this.url + '/GetAllUNEmployee', body);
  }
  getById(id: number) {
    return this.http.get<APIResponse<Employee>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: Employee) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: Employee, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
  disable(id: number) {
    return this.http.patch<APIResponse<any>>(this.url + '/' + id, {});
  }
}
