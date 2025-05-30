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
import { AdCooGeneralComponent } from './admin/components/coo/ad-coo-general/ad-coo-general.component';
import { CooAddComponent } from './admin/components/coo/coo-add/coo-add.component';
import { CooEditComponent } from './admin/components/coo/coo-edit/coo-edit.component';
import { CooDisplayComponent } from './admin/components/coo/coo-display/coo-display.component';
import { SettingComponent } from './admin/components/setting/setting.component';
import { EmEditComponent } from './admin/components/employee/em-edit/em-edit.component';
import { EmDisplayComponent } from './admin/components/employee/em-display/em-display.component';
import { EmInsuranceComponent } from './admin/components/employee/em-insurance/em-insurance.component';
import { EmSalaryComponent } from './admin/components/employee/em-salary/em-salary.component';
import { EmContractComponent } from './admin/components/employee/em-contract/em-contract.component';
import { InvoiceComponent } from './admin/components/invoice/invoice.component';
import { EmDSAComponent } from './admin/components/employee/em-dsa/em-dsa.component';
import { BillGenerateTemplateComponent } from './general/components/bill-generate-template/bill-generate-template.component';
import { EmFilesComponent } from './admin/components/employee/em-files/em-files.component';
import { CooFilesComponent } from './admin/components/coo/coo-files/coo-files.component';

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
          { path: 'add', component: EmAddComponent },
          { path: 'edit/:id', component: EmEditComponent },
          { path: 'display/:id', component: EmDisplayComponent },
          { path: 'insurance/:id/:name', component: EmInsuranceComponent },
          { path: 'salary/:id/:name', component: EmSalaryComponent },
          { path: 'bill/:id/:name/:salaryId', component: BillGenerateTemplateComponent },
          { path: 'dsa/:id/:name', component: EmDSAComponent },
          { path: 'contract/:id/:name', component: EmContractComponent },
          { path: 'file/:id/:name', component: EmFilesComponent }
        ]
      },
      {
        path: 'coo', children: [
          { path: '', component: AdCooGeneralComponent, },
          { path: 'add', component: CooAddComponent },
          { path: 'edit/:id', component: CooEditComponent },
          { path: 'display/:id', component: CooDisplayComponent },
          { path: 'file/:id', component: CooFilesComponent },
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
      {
        path: 'setting', component: SettingComponent,
      },
      {
        path: 'setting/:subTitle', component: SettingComponent,
      },
      {
        path: 'report', children: [
          { path: 'invoice', component: InvoiceComponent }
        ]
      },
      { path: '', component: AdHomeComponent },
      { path: '**', component: AdNotFoundComponent }],
  },
  {
    path: '', redirectTo: ({ queryParams }) => {
      const isAdmin = (localStorage.getItem('role') as string)?.toLowerCase();
      if (isAdmin === 'admin') {
        return 'admin';
      } else if (isAdmin === 'user') {
        return 'user';
      }
      return 'login';
    }, pathMatch: 'full'
  }
];
