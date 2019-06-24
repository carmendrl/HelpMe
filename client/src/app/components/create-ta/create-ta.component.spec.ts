import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTAComponent } from './create-ta.component';

describe('CreateTAComponent', () => {
  let component: CreateTAComponent;
  let fixture: ComponentFixture<CreateTAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
