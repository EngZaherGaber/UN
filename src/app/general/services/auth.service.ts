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
  constructor(
    private router: Router,
    private toastSrv: ToastService,
    private http: HttpClient
  ) { }
  login(body: LoginUser): Observable<any> {
    
    return this.http.post(environment.api + 'UserManagmentontroller/Login', body);
  }
}
