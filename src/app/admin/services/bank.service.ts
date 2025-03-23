import { Injectable } from '@angular/core';
import { Bank } from '../../general/interfaces/bank';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class BankService {
url = environment.api + 'BankManagement';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Bank[]>>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse<Bank>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: Bank) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: Bank, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
