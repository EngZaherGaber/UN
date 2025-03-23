import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';
import { PurchaseOrder } from '../../general/interfaces/purchase-order';

@Injectable({
  providedIn: 'root'
})
export class PoService {
  url = environment.api + 'PurchaseOrderManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<PurchaseOrder[]>>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse<PurchaseOrder>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: PurchaseOrder) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: PurchaseOrder, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
