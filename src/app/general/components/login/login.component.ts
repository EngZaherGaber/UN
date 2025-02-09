import { Component } from '@angular/core';
import { DynmaicFormComponent } from '../dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../interfaces/input-dynamic';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [DynmaicFormComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  objs: { [key: string]: InputDynamic[] } = {
    general: [
      {
        key: 'userName',
        label: 'Username',
        value: null,
        dataType: 'string',
        options: [],
        visible: true,
        command: (value, element, form) => { },
        required: true,
      },
      {
        key: 'password',
        label: 'Password',
        value: null,
        dataType: 'password',
        options: [],
        visible: true,
        command: (value, element, form) => { },
        required: true,
      },
    ],
  };
  constructor(private authSrv: AuthService, private router: Router) {
    authSrv.sessionDataClear();
  }
  submit(event: any) {
    this.authSrv.login(event.general).subscribe(res => {
      this.authSrv.sessionDataSave({ token: res.data })
      this.router.navigate(['admin'])
    });
  }
}
