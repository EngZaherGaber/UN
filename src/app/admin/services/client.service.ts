import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';
import { Client } from '../../general/interfaces/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  url = environment.api + 'ClientManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Client[]>>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse<Client>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: Client) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: Client, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
