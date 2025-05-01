import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { environment } from '../../../environments/environment';
import { Contract } from '../../general/interfaces/contract';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  url = environment.api + 'ContractManagment';
  constructor(private http: HttpClient) { }
  getAll(body: TableLazyLoadEvent, empId: number) {
    return this.http.post<APIResponse<Contract[]>>(this.url + '/GetAll/' + empId, body);
  }
  getById(id: number) {
    return this.http.get<APIResponse<Contract>>(this.url + '/' + id);
  }
  getActiveContractByEmployeeId(id: number) {
    return this.http.get<APIResponse<Contract>>(this.url + '/GetActiveContractByEmployeeId/' + id);
  }
  cancel(body: any, id: number) {
    return this.http.post<APIResponse<Contract>>(this.url + '/CancelContractAsync/' + id, body);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: Contract) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: Contract, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
  getAllPoNumber() {
    return this.http.get<APIResponse<{ poNumber: string }[]>>(this.url + '/GetAllPoNumber');
  }
}
