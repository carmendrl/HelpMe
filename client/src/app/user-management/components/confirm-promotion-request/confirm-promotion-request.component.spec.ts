import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPromotionRequestComponent } from './confirm-promotion-request.component';

describe('ConfirmPromotionRequestComponent', () => {
  let component: ConfirmPromotionRequestComponent;
  let fixture: ComponentFixture<ConfirmPromotionRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPromotionRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPromotionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
