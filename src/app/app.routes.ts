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
import { AdClientGeneralComponent } from './admin/components/client/ad-client-general/ad-client-general.component';
import { ClientAddComponent } from './admin/components/client/client-add/client-add.component';
import { ClientEditComponent } from './admin/components/client/client-edit/client-edit.component';
import { ClientDisplayComponent } from './admin/components/client/client-display/client-display.component';
import { AdCooGeneralComponent } from './admin/components/coo/ad-coo-general/ad-coo-general.component';
import { CooAddComponent } from './admin/components/coo/coo-add/coo-add.component';
import { CooEditComponent } from './admin/components/coo/coo-edit/coo-edit.component';
import { CooDisplayComponent } from './admin/components/coo/coo-display/coo-display.component';
import { AdTeamGeneralComponent } from './admin/components/team/ad-team-general/ad-team-general.component';
import { TeamAddComponent } from './admin/components/team/team-add/team-add.component';
import { TeamEditComponent } from './admin/components/team/team-edit/team-edit.component';
import { TeamDisplayComponent } from './admin/components/team/team-display/team-display.component';
import { AdPurchaseOrderGeneralComponent } from './admin/components/purchase-order/ad-purchase-order-general/ad-purchase-order-general.component';
import { PoAddComponent } from './admin/components/purchase-order/po-add/po-add.component';
import { PoEditComponent } from './admin/components/purchase-order/po-edit/po-edit.component';
import { PoDisplayComponent } from './admin/components/purchase-order/po-display/po-display.component';
import { AdBankGeneralComponent } from './admin/components/bank/ad-bank-general/ad-bank-general.component';
import { BankAddComponent } from './admin/components/bank/bank-add/bank-add.component';
import { BankEditComponent } from './admin/components/bank/bank-edit/bank-edit.component';
import { BankDisplayComponent } from './admin/components/bank/bank-display/bank-display.component';

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
        path: 'bank', children: [
          { path: '', component: AdBankGeneralComponent, },
          { path: 'add', component: BankAddComponent },
          { path: 'edit/:id', component: BankEditComponent },
          { path: 'display/:id', component: BankDisplayComponent },
        ]
      },
      {
        path: 'purchase-order', children: [
          { path: '', component: AdPurchaseOrderGeneralComponent, },
          { path: 'add', component: PoAddComponent },
          { path: 'edit/:id', component: PoEditComponent },
          { path: 'display/:id', component: PoDisplayComponent },
        ]
      },
      {
        path: 'team', children: [
          { path: '', component: AdTeamGeneralComponent, },
          { path: 'add', component: TeamAddComponent },
          { path: 'edit/:id', component: TeamEditComponent },
          { path: 'display/:id', component: TeamDisplayComponent },
        ]
      },
      {
        path: 'coo', children: [
          { path: '', component: AdCooGeneralComponent, },
          { path: 'add', component: CooAddComponent },
          { path: 'edit/:id', component: CooEditComponent },
          { path: 'display/:id', component: CooDisplayComponent },
        ]
      },
      {
        path: 'client', children: [
          { path: '', component: AdClientGeneralComponent, },
          { path: 'add', component: ClientAddComponent },
          { path: 'edit/:id', component: ClientEditComponent },
          { path: 'display/:id', component: ClientDisplayComponent },
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
