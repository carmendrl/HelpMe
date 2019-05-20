import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';

import { LabSession } from '../models/lab_session.model';

import { ModelFactoryService } from './model-factory.service';

@Injectable()
export class LabSessionService {

  private sessions : LabSession[];
  private apiHost : string;

  constructor(private httpClient : HttpClient, private _modelFactory : ModelFactoryService) {

    this.sessions = [
      _modelFactory.labSession1, _modelFactory.labSession2
    ];
    this.apiHost = host;
  }

  get labSessions() : Observable<Array<LabSession>> {
    return Observable.of(this.sessions);

    //Start added interaction with server code
        let url : string =`${this.apiHost}/lab_sessions/`;
        //all below needs to be changed (jjust copied from user.service)

        return this.httpClient.post<UserResponseData>(url, body).pipe(

          tap(r => this.updateLoggedInUserFromResponse(new UserResponse(r["data"]))),
          map(r => {
            return true
          }),
          catchError(error => this.handleError(error))
        );
  }
}
