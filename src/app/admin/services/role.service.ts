import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';
import { Role } from '../../general/interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  url = environment.api + 'RoleManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Role[]>>(this.url);
  }
}
