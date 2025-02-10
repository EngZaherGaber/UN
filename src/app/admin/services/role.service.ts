import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  url = environment.api + 'RoleManagment';
  constructor(private http: HttpClient) { }
  getAll(): Observable<any> {
    return this.http.get<APIResponse>(this.url);
  }
}
