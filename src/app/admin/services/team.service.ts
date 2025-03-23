import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';
import { User } from '../../general/interfaces/user';
import { Team } from '../../general/interfaces/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  url = environment.api + 'TeamManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Team[]>>(this.url + '/getAll');
  }
  getById(id: number) {
    return this.http.get<APIResponse<Team>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: Team) {
    return this.http.post<APIResponse<any>>(this.url, body);
  }
  edit(body: Team, id: number) {
    return this.http.put<APIResponse<any>>(this.url + '/' + id, body);
  }
}
