import { Injectable } from '@angular/core';
import { LaptopRent } from '../../general/interfaces/laptop-rent';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class LaptopRentService {
  url = environment.api + 'LaptopRentManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<LaptopRent[]>>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse<LaptopRent>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: LaptopRent) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: LaptopRent, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
