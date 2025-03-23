import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdBankGeneralComponent } from './ad-bank-general.component';

describe('AdBankGeneralComponent', () => {
  let component: AdBankGeneralComponent;
  let fixture: ComponentFixture<AdBankGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdBankGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdBankGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
