import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { API_SERVER } from '../app.config';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { LabSession } from '../models/lab_session.model';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';
import { ModelFactoryService } from './model-factory.service';
import { of } from 'rxjs/observable/of';

class LabsessionResponseAttributes {
  public description : string;
  public token : string;
  public activeStatus : boolean;
  public course_id : string;
  public start_date:string;
  public end_date:string;
}

class LabsessionResponseRelationships{
  public questions : LabsessionQuestionsData;
  public users: LabsessionResponseUsers;
  public course: LabsessionResponseCourse;
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

class LabsessionResponseCourse {
  public id: string;
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
  get Description() : string { return this.data.attributes["description"] }
  get Token() : string { return this.data.attributes["token"] }
  get ActiveStatus() : boolean { return this.data.attributes["active"] }
  get StartDate() : string { return this.data.attributes["start-date"]}
  get EndDate() : string { return this.data.attributes["end-date"]}
  get CourseId() : string { return this.data.attributes["course-id"]}
  get Rdata() : string[] { return this.data.relationships.questions["data"]}
  get userId() : string {return this.data.relationships.users.data["id"]}
  get userType() : string { return this.data.relationships.users.data["type"]}
}

@Injectable()
export class LabSessionService {
//
//   private sessions : LabSession[];
//   private _currentSessions$: Subject<LabSession>;
  private apiHost : string;
//   private noSession : LabSession;
//
  constructor(private httpClient : HttpClient, private _modelFactory : ModelFactoryService,@Inject(API_SERVER) host : string) {
    this.apiHost = host;
  }
//
//   get CurrentSessions$() : Observable<LabSession> {
//     return this._currentSessions$;
//   }
//
  labSessions() : LabSession[] {
        let url : string =`${this.apiHost}/lab_sessions`;
        return this.httpClient.get(url).pipe(
          map(r => r = createLabsessionsArray(r)),
          catchError(this.handleError<LabSession[]>(`labSessions`))
        );
        //return this._currentSessions$;
  }

  // createLabsessions(session : LabSession) : Observable<boolean> {
  //   let url : string = `${this.apiHost}/lab_sessions`;
  //   let body = this.buildCreateLabsessionBodyFromSession (session);
  //   return this.httpClient.post<LabsessionResponseData>(url, body).pipe(
  //     tap(r => this.updateLabsessionsFromResponse(new LabsessionResponse(r["data"]))),
  //     map(r => true ),
  //     catchError(error => this.handleError(error))
  //   );
  // }
  //
  private createLabsessionsArray(object: Object[]) : Labsessions[]{
    sessions : LabSessions[];
    for(let obj in object){
      sessions.push(buildCreateLabsessionFromJson(obj));
    }
    return sessions;
  }

    private buildCreateLabsessionFromJson(s: LabsessionResponse ) {
      return {
        description : s.description,
        start_date : s.startDate,
        end_date : s.endDate,
        course : ,

      };
    }
  //
  //   private updateLabsessionsFromResponse(r : LabsessionResponse) {
  //       let session = new LabSession();
  //       session.Description = r.Description;
  //       session.Id = r.Id;
  //       this._currentSessions$.next(session);
  //
  //   }
   private handleCreateAccountError (error) : Observable<boolean> {
      if (error instanceof HttpErrorResponse) {
        let httpError = <HttpErrorResponse> error;
        let errorMessage : string = "The account was not created for the following reasons:";
        let reasons = error.error.errors.full_messages.join(", ");
        console.log(reasons);
      }
      return of(false);
    }

    // private handleError (error) : Observable<boolean> {
    //   return of(false);
    // }
    private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead


    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}