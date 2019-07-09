import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyQuestionsStatusComponent } from './copy-questions-status.component';

describe('CopyQuestionsStatusComponent', () => {
  let component: CopyQuestionsStatusComponent;
  let fixture: ComponentFixture<CopyQuestionsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyQuestionsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyQuestionsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
