import { Routes } from '@angular/router';
import { LoginComponent } from './general/components/login/login.component';
import { AdminComponent } from './admin/components/admin/admin.component';
import { AdGeneralEmployeeComponent } from './admin/components/employee/ad-general-employee/ad-general-employee.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [{ path: 'employee', component: AdGeneralEmployeeComponent }],
  },
];
