import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  // Management
  getAll(body: TableLazyLoadEvent, poNumber?: string) {
    let params = new HttpParams();
    if (poNumber) {
      params = params.append('PoNumber', poNumber);
      return this.http.post<APIResponse<Employee[]>>(this.url + '/GetAllUNEmployee', body, { params: params });
    }
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

  // Files
  upload(id: number, files: File | null) {
    const formData = new FormData();
    if (files) {
      formData.append('files', files);
    }
    return this.http.post<APIResponse<any>>(this.url + '/upload/' + id, formData);
  }
  getFiles(id: number) {
    return this.http.get<APIResponse<any>>(this.url + '/files/' + id);
  }
  downloadFiles(id: number, fileName: string) {
    return this.http.get(this.url + '/download/' + id + '/' + fileName, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'blob'
    },
    );
  }
  deleteFile(id: number, fileName: string) {
    return this.http.delete<APIResponse<any>>(this.url + '/delete/' + id + '/' + fileName);
  }
  deleteAllFiles(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/deleteAll/' + id);
  }
}
