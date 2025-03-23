import { Injectable } from '@angular/core';
import { TypeOfContract } from '../../general/interfaces/type-of-contract';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class TypeOfContractService {
  url = environment.api + 'TypeOfContractManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<TypeOfContract[]>>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse<TypeOfContract>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: TypeOfContract) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: TypeOfContract, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
