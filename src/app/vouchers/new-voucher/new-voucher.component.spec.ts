import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVoucherComponent } from './new-voucher.component';

describe('NewVoucherComponent', () => {
  let component: NewVoucherComponent;
  let fixture: ComponentFixture<NewVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
