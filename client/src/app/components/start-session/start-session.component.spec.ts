import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartSessionComponent } from './start-session.component';

describe('StartSessionComponent', () => {
  let component: StartSessionComponent;
  let fixture: ComponentFixture<StartSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
