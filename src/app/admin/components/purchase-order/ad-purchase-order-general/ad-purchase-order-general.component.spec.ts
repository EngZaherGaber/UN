import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPurchaseOrderGeneralComponent } from './ad-purchase-order-general.component';

describe('AdPurchaseOrderGeneralComponent', () => {
  let component: AdPurchaseOrderGeneralComponent;
  let fixture: ComponentFixture<AdPurchaseOrderGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdPurchaseOrderGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdPurchaseOrderGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
