import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDisplayComponent } from './po-display.component';

describe('PoDisplayComponent', () => {
  let component: PoDisplayComponent;
  let fixture: ComponentFixture<PoDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
