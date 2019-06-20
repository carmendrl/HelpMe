import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPreviousQuestionsComponent } from './search-previous-questions.component';

describe('SearchPreviousQuestionsComponent', () => {
  let component: SearchPreviousQuestionsComponent;
  let fixture: ComponentFixture<SearchPreviousQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPreviousQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPreviousQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
