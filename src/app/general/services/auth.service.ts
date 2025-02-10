import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginUser } from '../interfaces/login-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.api + 'users/';
  constructor(private http: HttpClient) { }
  login(body: LoginUser): Observable<any> {
    return this.http.post(this.url + 'Login', body);
  }
  sessionDataSave(data: { [key: string]: string }) {
    Object.keys(data).forEach(key => {
      localStorage.setItem(key, data[key]);
    })
  }
  sessionDataClear() {
    localStorage.clear();
  }
  sessionDataRemove(item: string) {
    localStorage.removeItem(item);
  }
}
