import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { API_SERVER } from '../app.config';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { LabSession } from '../models/lab_session.model';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';
import { ModelFactoryService } from './model-factory.service';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { SessionViewComponent } from '../components/session-view/session-view.component';


//start of LabSessionService class
@Injectable()
export class LabSessionService {
  private apiHost : string;
  public _newLabSession$: Subject<LabSession>;
  public sessionId: number;

  constructor(private httpClient : HttpClient,@Inject(API_SERVER) host : string) {
    this.apiHost = host;
    this._newLabSession$ = new Subject<LabSession>();
  }

//returns a list of all the labsessions
  labSessions() : Observable<LabSession[]> {
    let url : string =`${this.apiHost}/lab_sessions`;
    return this.httpClient.get(url).pipe(
      map(r => this.createLabsessionsArray(r["data"], r["included"] )),
      catchError(this.handleError<LabSession[]>(`labSessions`))
    );
  }

  private createLabsessionsArray(objects: Object[], includedResponses: Object[]) : LabSession[]{
    let sessions = new Array<LabSession>();

    //loop through the labsessions and push them onto an array after reformating
    for(let object of objects){

      //search for the course information
      var course: Object = includedResponses.find(function(element) {
        return element["type"] === "courses" && element["id"]=== object["attributes"]["course_id"];
      });


      //search for the professor information
      var prof : Object = includedResponses.find(function(element) {
        return element["type"]==="professors" && element["id"]=== course["relationships"]["instructor"]["data"]["id"];
      });
      sessions.push(this.buildCreateLabsessionFromJson(object, course, prof));

    }
    sessions= sessions.sort(function(a, b){
      if(a.startDate> b.startDate){
        return 1;
      }
      else{
        return -1;
      }
    });
    return sessions;
  }


  private buildCreateLabsessionFromJson(s: Object, a: Object, b: Object ) : LabSession {
    // let l = new LabsessionResponse(s);
    // let c = new IncludedCourseResponse (a);
    // let d = new IncludedProfessorResponse (b);

    // let prof = new User(d.Email, d.Username, d.FirstName, d.LastName, d.Type,d.Id);
    // let course = new Course(c.Subject, c.Number, c.Title, c.Semester, prof, c.Id);
    // let session = new LabSession(l.Description, l.StartDate, l.EndDate, course);
    let prof = User.createFromJson(s);
    let course = Course.createFromJson(a);
    let session = LabSession.createFromJson(b);
    course.professor = prof;
    session.course = course;

    return session;
  }



  createNewLabSession(description:String, courseId:number, startDate: string, endDate: string): Observable<LabSession> {
    let url : string =`${this.apiHost}/lab_sessions`;
    let body = {
      description: description,
      course_id: courseId,
      start_date: startDate,
      end_date: endDate
    };
    return this.httpClient.post(url, body).pipe(
      map(r => this.createNewLabSessionFromJson(r["data"], r["included"])),
      catchError(this.handleError<LabSession>(`accesssingTokenAndId`))
    );

  }

  createNewLabSessionFromJson(r: Object[], includedResponses:any[]): LabSession{
    var course: Object = includedResponses.find(function(element) {
      return element["type"] === "courses" && element["id"]=== r["attributes"]["course_id"];
    });
    //search for the professor information
    var prof : Object = includedResponses.find(function(element) {
      return element["type"]==="professors" && element["id"]=== course["relationships"]["instructor"]["data"]["id"];
    });
  
    let professor = User.createFromJson(prof);
    let newCourse = Course.createFromJson(course);
    let session = LabSession.createFromJson(r);
    newCourse.professor = professor;
    session.course = newCourse;

    this._newLabSession$.next(session);
    return session;
}

    get newLabSession$() : Observable<LabSession> {
      return this._newLabSession$;
}

//allows a user to join a session with a token and returns a session id
  joinASession(token: String): Observable<number>{
    let url: string = `${this.apiHost}/lab_sessions/join/${token}`;
    let body = {
      token: token
    };
    return this.httpClient.post(url, body).pipe(
      map(r => this.extractSessionId(r["data"])),
      catchError(this.handleError<number>(`joining a lab session`))
    );
  }

  private extractSessionId(r: Object): number {
    //let s = new sessionResponse(r);
    this.sessionId = r["data"]["relationships"]["lab_session"]["data"]["id"];
    return this.sessionId;
  }

  getSession(id: number): Observable<LabSession>{
    let url = `${this.apiHost}/lab_sessions/${this.sessionId}`;
    return this.httpClient.get<LabSession>(url).pipe(
      catchError(this.handleError<LabSession>(`getSession id=${this.sessionId}`))
    );

  }

//handles errors
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead


      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
