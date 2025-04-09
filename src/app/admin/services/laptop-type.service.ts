import { Injectable } from '@angular/core';
import { LaptopType } from '../../general/interfaces/laptop-type';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class LaptopTypeService {
  url = environment.api + 'LaptopTypeManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<LaptopType[]>>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse<LaptopType>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: LaptopType) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: LaptopType, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
