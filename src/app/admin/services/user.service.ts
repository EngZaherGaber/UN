import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.api + 'users';
  constructor(private http: HttpClient) { }
  getAll(): Observable<any> {
    return this.http.get(this.url);
  }
  delete(id:number) {
    return this.http.delete(this.url + '/' + id);
  }
}
