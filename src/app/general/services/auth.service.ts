import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private toastSrv: ToastService) {}
  login(body: { username: string; hashPassword: string }) {
    if (body.username === 'admin' && body.hashPassword === 'admin') {
      this.router.navigate(['admin']);
    } else {
      this.toastSrv.showError('Falied!', 'Username or Password is incorrect');
    }
  }
}
