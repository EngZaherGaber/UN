import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';
import { Transport } from '../../general/interfaces/transport';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  url = environment.api + 'TransportCompensation';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Transport[]>>(this.url);
  }
  add(body: Transport) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
}
