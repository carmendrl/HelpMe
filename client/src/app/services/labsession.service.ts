import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { API_SERVER } from '../app.config';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { LabSession } from '../models/lab_session.model';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';
import { ModelFactoryService } from './model-factory.service';
import { Subject } from 'rxjs/Subject';

class LabsessionResponseAttributes {
  public description : string;
  public token : string;
  public activeStatus : boolean;
  public course_id : string;
}

class LabsessionResponseRelationships{
  public questions : LabsessionQuestionsData;
  public users: LabsessionResponseUsers;
}

class LabsessionQuestionsData{
  public data : string[];
}

class LabsessionResponseUsers {
  public data : LabsessionResponseUsersData;
}

class LabsessionResponseUsersData {
  public id : string;
  public type: string;
}



class LabsessionResponseData {
  public type : string;
  public id : string;
  public attributes: LabsessionResponseAttributes;
  public relationships : LabsessionResponseRelationships;
}

class LabsessionResponse {
  constructor (private data : LabsessionResponseData) {
	}
  get Type() : string { return this.data.type }
  get Id() : string { return this.data.id }
  get Description() : string { return this.data.attributes.description }
  get Token() : string { return this.data.attributes.token }
  get ActiveStatus() : string { return this.data.attributes.activeStatus }
  get CourseId() : string { return this.data.attributes.courseId }
  get Rdata() : string[] { return this.data.relationships.questions.data}
  get userId() : string {return this.data.relationships.users.data.id}
  get userType() : string { return this.data.relationships.users.data.type}
}

@Injectable()
export class LabSessionService {

  private sessions : LabSession[];
  private apiHost : string;

  constructor(private httpClient : HttpClient, private _modelFactory : ModelFactoryService, @Inject(API_SERVER) host : string) {

    this.sessions = [
      _modelFactory.labSession1, _modelFactory.labSession2
    ];
    this.apiHost = host;
  }

  get labSessions() : Observable<LabSession[]> {
    //return Observable.of(this.sessions);

    //Start added interaction with server code
        let url : string =`${this.apiHost}/lab_sessions/`;
        //all below needs to be changed (jjust copied from user.service)

        return this.httpClient.post<UserResponseData>(url, body).pipe(

          tap(r => (new UserResponse(r["data"]))),
          map(r => {
            return true
          }),
          catchError(error => this.handleError(error))
        );
  }

    private updateLabsessionsFromResponse(r : UserResponse) {
        let session = new Labsession();
        session._description = r._description;
        user._startDate = r._startDate;
        user._endDate = r._endDate;
        user._course = r._course;
        user.__course.professor = r._course.professor;
    }
}
