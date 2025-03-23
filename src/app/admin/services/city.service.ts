import { Injectable } from '@angular/core';
import { City } from '../../general/interfaces/city';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  url = environment.api + 'CityManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<City[]>>(this.url + '/getAll');
  }
  getById(id: number) {
    return this.http.get<APIResponse<City>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: City) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: City, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
