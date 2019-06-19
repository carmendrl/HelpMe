import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionSearchComponent } from './session-search.component';

describe('SessionSearchComponent', () => {
  let component: SessionSearchComponent;
  let fixture: ComponentFixture<SessionSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
