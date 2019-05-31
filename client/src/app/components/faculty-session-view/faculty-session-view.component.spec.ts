import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultySessionViewComponent } from './faculty-session-view.component';

describe('FacultySessionViewComponent', () => {
  let component: FacultySessionViewComponent;
  let fixture: ComponentFixture<FacultySessionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultySessionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultySessionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
