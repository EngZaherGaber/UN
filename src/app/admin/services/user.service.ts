import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../general/interfaces/user';
import { APIResponse } from '../../general/interfaces/response';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.api + 'users';
  constructor(private http: HttpClient) { }
  getAll(body: TableLazyLoadEvent): Observable<any> {
    return this.http.post<APIResponse<User[]>>(this.url + '/GetAllUsers', body);
  }
  getById(id: number) {
    return this.http.get<APIResponse<User>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: User) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: User, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
  resetPassword(body: { userId: number, newPassword: string }) {
    return this.http.post<APIResponse<any>>(this.url + '/ResetPasswordForAdmin', body);
  }
  changePassword(body: { userId: number, newPassword: string }) {
    return this.http.post<APIResponse<any>>(this.url + '/ChangePassword', body);
  }
}
