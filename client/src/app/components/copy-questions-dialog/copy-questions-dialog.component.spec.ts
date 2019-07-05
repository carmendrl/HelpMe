import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyQuestionsDialogComponent } from './copy-questions-dialog.component';

describe('CopyQuestionsDialogComponent', () => {
  let component: CopyQuestionsDialogComponent;
  let fixture: ComponentFixture<CopyQuestionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyQuestionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyQuestionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
