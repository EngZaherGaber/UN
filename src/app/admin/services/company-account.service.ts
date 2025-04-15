import { Injectable } from '@angular/core';
import { CopmanyAccount } from '../../general/interfaces/company-account';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class CompanyAccountService {
  url = environment.api + 'AccountCompanyManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<CopmanyAccount[]>>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse<CopmanyAccount>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: CopmanyAccount) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: CopmanyAccount, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
