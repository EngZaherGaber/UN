import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../general/interfaces/response';
import { Insurance } from '../../general/interfaces/insurance';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  url = environment.api + 'InsuranceManagment';
  constructor(private http: HttpClient) { }
  getAll(body: TableLazyLoadEvent) {
    return this.http.post<APIResponse<Insurance[]>>(this.url + '/GetAll', body);
  }
  getById(id: number) {
    return this.http.get<APIResponse<Insurance>>(this.url + '/' + id);
  }
  edit(body: Insurance, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
