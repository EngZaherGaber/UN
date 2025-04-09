import { Component } from '@angular/core';
import { DynmaicFormComponent } from '../dynmaic-form/dynmaic-form.component';
import { InputDynamic } from '../../interfaces/input-dynamic';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-login',
  imports: [DynmaicFormComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  helper: JwtHelperService = new JwtHelperService();
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
    this.authSrv.login(event).subscribe(res => {
      const subToken = this.helper.decodeToken(res.data);
      const exp = this.convertStringToDate(subToken.expDate as string)?.toISOString();
      const obj = {
        token: res.data,
        username: subToken.family_name,
        role: subToken.role,
        userId: subToken.sub,
        expired: exp ?? ''
      }
      this.authSrv.sessionDataSave(obj);
      if ((subToken.role as string).toLowerCase() === 'admin') {
        this.router.navigate(['admin'])
      } else {
        this.router.navigate(['user'])

      }
    });
  }
  convertStringToDate(dateString: string): Date | null {
    // Split the date and time
    const [datePart, timePart] = dateString.split(' ');

    // Split the date into day, month, year
    const [day, month, year] = datePart.split('/').map(Number);

    // Split the time into hours and minutes
    const [hours, minutes] = timePart.split(':').map(Number);

    // Create a new Date object (months are 0-indexed in JavaScript)
    const date = new Date(year, month - 1, day, hours, minutes);

    // Check if the date is valid
    return isNaN(date.getTime()) ? null : date;
  }
}
