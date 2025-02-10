import { Routes } from '@angular/router';
import { LoginComponent } from './general/components/login/login.component';
import { AdminComponent } from './admin/components/admin/admin.component';
import { AdGeneralEmployeeComponent } from './admin/components/employee/ad-general-employee/ad-general-employee.component';
import { EmAddComponent } from './admin/components/employee/em-add/em-add.component';
import { AdUserGeneralComponent } from './admin/components/user/ad-user-general/ad-user-general.component';
import { UserAddComponent } from './admin/components/user/user-add/user-add.component';
import { adminGuard } from './admin/guards/admin.guard';
import { adminCanActiveGuard } from './admin/guards/admin-can-active.guard';
import { AdNotFoundComponent } from './admin/components/ad-not-found/ad-not-found.component';
import { UserEditComponent } from './admin/components/user/user-edit/user-edit.component';
import { UserDisplayComponent } from './admin/components/user/user-display/user-display.component';
import { AdHomeComponent } from './admin/components/ad-home/ad-home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivateChild: [adminGuard],
    canActivate: [adminCanActiveGuard],
    children: [
      {
        path: 'employee', children: [
          { path: '', component: AdGeneralEmployeeComponent, },
          { path: 'add', component: EmAddComponent }
        ]
      },
      {
        path: 'user', children: [
          { path: '', component: AdUserGeneralComponent, },
          { path: 'add', component: UserAddComponent },
          { path: 'edit/:id', component: UserEditComponent },
          { path: 'display/:id', component: UserDisplayComponent },
        ]
      },
      { path: '', component: AdHomeComponent },
      { path: '**', component: AdNotFoundComponent }],
  },
  {
    path: '', redirectTo: ({ queryParams }) => {
      const isAdmin = (localStorage.getItem('role') as string)?.toLowerCase() === 'admin';
      if (isAdmin) {
        return 'admin';
      }
      return 'user';
    }, pathMatch: 'full'
  }
];
