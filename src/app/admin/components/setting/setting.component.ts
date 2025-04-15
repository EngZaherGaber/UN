import { Component, OnInit, SimpleChanges } from '@angular/core';
import { TabsModule } from "primeng/tabs";
import { DialogModule } from "primeng/dialog";
import { AdTemplateComponent } from '../ad-template/ad-template.component';
import { AdGeneralRateComponent } from '../ad-general-rate/ad-general-rate.component';
import { CommonModule } from '@angular/common';
import { AdGeneralContractTypeComponent } from '../ad-general-contract-type/ad-general-contract-type.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AdGeneralCityComponent } from '../ad-general-city/ad-general-city.component';
import { AdBankGeneralComponent } from '../bank/ad-bank-general/ad-bank-general.component';
import { AdClientGeneralComponent } from '../client/ad-client-general/ad-client-general.component';
import { AdTeamGeneralComponent } from '../team/ad-team-general/ad-team-general.component';
import { AdGeneralLaptopTypeComponent } from '../ad-general-laptop-type/ad-general-laptop-type.component';
import { AdGeneralLaptopRentComponent } from '../ad-general-laptop-rent/ad-general-laptop-rent.component';
import { AdGeneralCompanyAccountComponent } from '../ad-general-company-account/ad-general-company-account.component';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
  imports: [
    TabsModule,
    AdTemplateComponent,
    AdGeneralRateComponent,
    AdGeneralContractTypeComponent,
    DialogModule,
    CommonModule,
    AdGeneralCityComponent,
    AdBankGeneralComponent,
    AdClientGeneralComponent,
    AdTeamGeneralComponent,
    AdGeneralLaptopTypeComponent,
    AdGeneralLaptopRentComponent,
    AdGeneralCompanyAccountComponent
  ],
  standalone: true,
})
export class SettingComponent implements OnInit {
  subTitle: string = '';
  checkInterval: any;
  previousSubTitle: string = '';
  tabs: string[] = [
    'Rate',
    'Type of contract',
    'City',
    'Bank',
    'Company Account',
    'Client',
    'Team',
    'Laptop',
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.fragment.subscribe(x => {
      this.subTitle = x ?? '';
    })
  }
  ngOnInit() {
    this.checkInterval = setInterval(() => {
      if (this.previousSubTitle !== this.subTitle) {
        this.previousSubTitle = this.subTitle;
        this.router.navigate([], { fragment: this.subTitle })
      }
    }, 1000); // Check every 100ms
  }

}
