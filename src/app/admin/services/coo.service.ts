import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';
import { User } from '../../general/interfaces/user';
import { COO } from '../../general/interfaces/coo';

@Injectable({
  providedIn: 'root'
})
export class CooService {
  url = environment.api + 'CooManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<COO[]>>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse<COO>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: COO) {
    return this.http.post<APIResponse<any>>(this.url, body);

  }
  edit(body: COO, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
