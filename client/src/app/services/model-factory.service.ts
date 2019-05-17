import { Injectable } from '@angular/core';

import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { LabSession } from '../models/lab_session.model';

@Injectable()
export class ModelFactoryService {

  private _mcfall : User;
  private _csci150 : Course;
  private _csci495 : Course;
  private _labsession1 : LabSession;
  private _labsession2 : LabSession;

  constructor() {
    this._mcfall = new User("mcfall@hope.edu", "mcfall", "Ryan", "McFall", "professors");
    this._csci150 = new Course("CSCI", "150", "Web Design & Implementation", "201801", this.mcfall);
    this._csci495 = new Course("CSCI", "495", "Web Apps - Javascript prog", "201801", this.mcfall);

    this._labsession1 = new LabSession("Lab 1", new Date("January 9, 2018 09:30:00"), new Date("January 9, 2018 11:00:00"), this._csci150);
    this._labsession2 = new LabSession("Lab 1", new Date("January 11, 2018 09:30:00"), new Date("January 11, 2018 11:00:00"), this._csci495)
  }

  get mcfall() : User {
    return this._mcfall;
  }

  get csci150() : Course {
    return this._csci150;
  }

  get csci495() : Course {
    return this._csci495;
  }

  get labSession1() : LabSession {
    return this._labsession1;
  }

  get labSession2() : LabSession {
    return this._labsession2;
  }
}
