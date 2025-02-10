import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../general/interfaces/user';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.api + 'users';
  constructor(private http: HttpClient) { }
  getAll(): Observable<any> {
    return this.http.get<APIResponse>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse>(this.url + '/' + id);
  }
  add(body: User) {
    return this.http.post<APIResponse>(this.url, body);

  }
  edit(body: User,id:number) {
    return this.http.put<APIResponse>(this.url + '/' + id, body);

  }
}
