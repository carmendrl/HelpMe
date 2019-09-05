import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SessionExceptionDialogComponent } from './session-exception-dialog.component';

import * as moment from 'moment';

describe('SessionExceptionDialogComponent', () => {
  let component: SessionExceptionDialogComponent;
  let fixture: ComponentFixture<SessionExceptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionExceptionDialogComponent ],
      imports: [ NgbModule ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExceptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add date to selected dates when onToggleDate called for checked element ', () => {
    let event = {
      "srcElement": {
        "checked": true
      }
    };

    let date : Date = moment("2019-07-25").toDate();
    component.onToggleDate(event, date);

    expect(component.SelectedDates.length).toEqual(1);
  });

  it('should remove date from selected dates when onToggleDate called for checked element ', () => {
    let event = {
      "srcElement": {
        "checked": true
      }
    };

    let date: Date = moment("2019-07-25").toDate();
    component.onToggleDate(event, date);

    event.srcElement.checked=false;
    component.onToggleDate(event, date);

    expect(component.SelectedDates.length).toEqual(0);
  });

});
