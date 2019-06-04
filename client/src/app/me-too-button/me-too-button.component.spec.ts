import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeTooButtonComponent } from './me-too-button.component';

describe('MeTooButtonComponent', () => {
  let component: MeTooButtonComponent;
  let fixture: ComponentFixture<MeTooButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeTooButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeTooButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
