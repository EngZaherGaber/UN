import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';
import { Rate } from '../../general/interfaces/rate';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  url = environment.api + 'UnRateManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Rate[]>>(this.url);
  }
  add(body: Rate) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
}
