import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';
import { Leave } from '../../general/interfaces/leave';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  url = environment.api + 'UnMonthLeave';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Leave[]>>(this.url);
  }
  add(body: Leave) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
}
