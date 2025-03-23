import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDisplayComponent } from './bank-display.component';

describe('BankDisplayComponent', () => {
  let component: BankDisplayComponent;
  let fixture: ComponentFixture<BankDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
