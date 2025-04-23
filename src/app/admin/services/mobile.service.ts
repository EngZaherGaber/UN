import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';
import { Transport } from '../../general/interfaces/transport';
import { Mobile } from '../../general/interfaces/mobile';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  url = environment.api + 'UnMobileCompensation';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Mobile[]>>(this.url);
  }
  add(body: Mobile) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
}
