import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';

import { LabSession } from '../models/lab_session.model';

import { ModelFactoryService } from './model-factory.service';

@Injectable()
export class LabSessionService {

  private sessions : LabSession[];

  constructor(private _modelFactory : ModelFactoryService) {

    this.sessions = [
      _modelFactory.labSession1, _modelFactory.labSession2
    ];

  }

  get labSessions() : Observable<Array<LabSession>> {
    return Observable.of(this.sessions);
  }
}
