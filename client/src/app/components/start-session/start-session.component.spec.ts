import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageServiceModule } from 'angular-webstorage-service';

import { StartSessionComponent } from './start-session.component';
import { CreateCourseFormComponent } from '../create-course-form/create-course-form.component';

import { LabSessionService } from '../../services/labsession.service';
import { UserService } from '../../services/user.service';
import { CourseService } from '../../services/course.service';

describe('StartSessionComponent', () => {
  let component: StartSessionComponent;
  let fixture: ComponentFixture<StartSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartSessionComponent, CreateCourseFormComponent ],
      imports: [ FormsModule, NgbModule, RouterTestingModule, HttpClientTestingModule, StorageServiceModule ],
      providers: [ LabSessionService, UserService, CourseService ]
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

  it('should set exception list to empty list after construction', () => {
    expect(component.SessionExceptions).toBeDefined();
  });

  it('should give back correct values for PossibleSessionDates for bi-weekly sessions', () => {
    component.RepeatFrequency='biweekly';
    // months are 0 indexed, so this is December
    // Will have sessions for Dec 15, 29
    component.StartMonth = 11;
    component.StartDay = 15;
    component.StartYear = 2018;

    //  Last session will be January 12
    component.LastRepeatMonth = 0;
    component.LastRepeatDay = 12;
    component.LastRepeatYear = 2019;

    let sessionDates = component.PossibleSessionDates;

    expect (sessionDates.length).toEqual(3);

    expect (sessionDates[0].getMonth()+1).toEqual(12);
    expect (sessionDates[0].getDate()).toEqual(15);
    expect (sessionDates[0].getFullYear()).toEqual(2018);

    expect (sessionDates[1].getMonth()+1).toEqual(12);
    expect (sessionDates[1].getDate()).toEqual(29);
    expect (sessionDates[1].getFullYear()).toEqual(2018);

    expect (sessionDates[2].getMonth()+1).toEqual(1);
    expect (sessionDates[2].getDate()).toEqual(12);
    expect (sessionDates[2].getFullYear()).toEqual(2019);
  });

  it('should give back correct values for PossibleSessionDates for monthly sessions', () => {
    component.RepeatFrequency='monthly';
    // months are 0 indexed, so this is December
    component.StartMonth = 11;
    component.StartDay = 1;
    component.StartYear = 2018;

    //  months are 0 indexed, so this is February
    component.LastRepeatMonth = 1;
    component.LastRepeatDay = 1;
    component.LastRepeatYear = 2019;

    let sessionDates = component.PossibleSessionDates;

    expect (sessionDates.length).toEqual(3);

    expect (sessionDates[0].getMonth()+1).toEqual(12);
    expect (sessionDates[0].getDate()).toEqual(1);
    expect (sessionDates[0].getFullYear()).toEqual(2018);

    expect (sessionDates[1].getMonth()+1).toEqual(1);
    expect (sessionDates[1].getDate()).toEqual(1);
    expect (sessionDates[1].getFullYear()).toEqual(2019);

    expect (sessionDates[2].getMonth()+1).toEqual(2);
    expect (sessionDates[2].getDate()).toEqual(1);
    expect (sessionDates[2].getFullYear()).toEqual(2019);
  });

  it('should give back correct values for PossibleSessionDates for weekly sessions', () => {
    //  1 session in December, 5 sessions in January, 1 in February
    component.RepeatFrequency = 'weekly';
    component.StartMonth = 11;
    component.StartDay = 25;
    component.StartYear = 2018;

    //  months are 0 indexed, so this is February
    component.LastRepeatMonth = 1;
    component.LastRepeatDay = 5;
    component.LastRepeatYear = 2019;

    let sessionDates = component.PossibleSessionDates;

    expect (sessionDates.length).toEqual(7);

    expect (sessionDates[0].getMonth()+1).toEqual(12);
    expect (sessionDates[0].getDate()).toEqual(25);
    expect (sessionDates[0].getFullYear()).toEqual(2018);

    expect (sessionDates[1].getMonth()+1).toEqual(1);
    expect (sessionDates[1].getDate()).toEqual(1);
    expect (sessionDates[1].getFullYear()).toEqual(2019);

    expect (sessionDates[2].getMonth()+1).toEqual(1);
    expect (sessionDates[2].getDate()).toEqual(8);
    expect (sessionDates[2].getFullYear()).toEqual(2019);

    expect (sessionDates[3].getMonth()+1).toEqual(1);
    expect (sessionDates[3].getDate()).toEqual(15);
    expect (sessionDates[3].getFullYear()).toEqual(2019);

    expect (sessionDates[4].getMonth()+1).toEqual(1);
    expect (sessionDates[4].getDate()).toEqual(22);
    expect (sessionDates[4].getFullYear()).toEqual(2019);

    expect (sessionDates[5].getMonth()+1).toEqual(1);
    expect (sessionDates[5].getDate()).toEqual(29);
    expect (sessionDates[5].getFullYear()).toEqual(2019);

    expect (sessionDates[6].getMonth()+1).toEqual(2);
    expect (sessionDates[6].getDate()).toEqual(5);
    expect (sessionDates[6].getFullYear()).toEqual(2019);
  });

  it('clicking add exception should open SessionExceptionDialog', () => {

  });
});
