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

//Beginning of Labsession Response Hierarchy
class LabsessionResponseAttributes {
  public description : string;
  public token : string;
  public active : boolean;
  public course_id : number;
  public start_date: Date;
  public end_date: Date;
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
  public id : number;
  public type: string;
}

class LabsessionResponseCourse {
  public data: LabsessionResponseCourseData;
}

class LabsessionResponseCourseData {
  public id: number;
  public type: string;
}


class LabsessionResponseData {
  public id: number;
  public type : string;
  public attributes: LabsessionResponseAttributes;
  public relationships : LabsessionResponseRelationships;
}

//getters for Labsession response
class LabsessionResponse {
  constructor (private data : LabsessionResponseData) {
  }
  get Type() : string { return this.data.type }
  get Id() : number { return this.data.id }
  get Description() : string { return this.data.attributes["description"] }
  get Token() : string { return this.data.attributes["token"] }
  get ActiveStatus() : boolean { return this.data.attributes["active"] }
  get StartDate() : Date { return this.data.attributes["start_date"]}
  get EndDate() : Date { return this.data.attributes["end_date"]}
  get CourseId() : number { return this.data.attributes["course_id"]}
  get Rdata() : string[] { return this.data.relationships.questions["data"]}
  get userId() : number {return this.data.relationships.users.data["id"]}
  get userType() : string { return this.data.relationships.users.data["type"]}
}

//getters for Course
class IncludedCourseResponse{
  constructor (private data: IncludedCourseResponseData){
  }
  get Id(): number {return this.data.id}
  get Type(): string {return this.data.type}
  get Title(): string {return this.data.attributes["title"]}
  get Subject():string {return this.data.attributes["subject"]}
  get Number(): string {return this.data.attributes["number"]}
  get Semester(): string {return this.data.attributes["semester"]}
  get ProfId() :number {return this.data.relationships.instructor.data["id"]}
  get ProfType() :string {return this.data.relationships.instructor.data["type"]}

}

//start of included Course hierarchy
class IncludedCourseResponseData{
  public type : string;
  public id : number;
  public attributes: IncludedCourseResponseAttributes;
  public relationships : IncludedCourseResponseInstructor;
}

class IncludedCourseResponseAttributes{
  public title: string;
  public subject: string;
  public number: string;
  public semester: string;
}

class IncludedCourseResponseInstructor{
  public instructor:  IncludedCourseResponseInstructorData;
}

class IncludedCourseResponseInstructorData{
  public data:IncludedCourseResponseInstructorDataDetails;
}

class IncludedCourseResponseInstructorDataDetails{
  public id:  number;
  public type: string;

}

//getters for Included Professor
class IncludedProfessorResponse{
  constructor (private data: IncludedProfessorResponseData){
  }
  get Id() : number { return this.data.id }
  get Type() : string { return this.data.type }
  get Email() : string { return this.data.attributes["email"]}
  get Username() : string {return this.data.attributes["username"]}
  get Role() : string {return this.data.attributes["role"]}
  get FirstName() : string {return this.data.attributes["first_name"]}
  get LastName() : string {return this.data.attributes["last_name"]}

}

//Start of Included Professor hierarchy
class IncludedProfessorResponseData{
  public id : number;
  public type : string;
  public attributes: IncludedProfessorAttributes;
}

class IncludedProfessorAttributes{
  public email: string;
  public username: string;
  public role: string;
  public firstNmae: string;
  public lastName: string;
}

//session response after joining a session
//start of sesssion response hierarchy
class sessionResponseData{
  public id: number;
  public type: string;
  public attributes: sessionAttributes;
  public relationships: sessionRelationships;
}

class sessionAttributes{

  public created_at: string;
}

class sessionRelationships{
  public lab_session: joinLabsession
  public user: userResponse;
}

class joinLabsession{
  public data: labsessionRelationshipData;
}

class labsessionRelationshipData{
  public id: number;
  public type: string;
}

class userResponse{
  public data: userResponseData;
}

class userResponseData{
  public id: number;
  public type: string;
}

// getter for join session
class sessionResponse{
  constructor(private response: sessionResponseData){

  }
  get Id(): number {return this.response.id}
  get Type(): string {return this.response.type}
  get Time(): string {return this.response.attributes["created_at"]}
  get SessionId(): number {return this.response.relationships.lab_session.data["id"]}
  get SessionType(): string {return this.response.relationships.lab_session.data["type"]}
  get UserId(): number {return this.response.relationships.user.data["id"]}
  get UserType(): string {return this.response.relationships.user.data["type"]}
}


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

  private createLabsessionsArray(dataResponses: LabsessionResponseData[], includedResponses: any[]) : LabSession[]{
    let sessions = new Array<LabSession>();

    //loop through the labsessions and push them onto an array after reformating
    for(let dataResponse of dataResponses){

      //search for the course information
      var course: IncludedCourseResponseData = includedResponses.find(function(element) {
        return element["type"] === "courses" && element["id"]=== dataResponse.attributes["course_id"];
      });


      //search for the professor information
      var prof : IncludedProfessorResponseData = includedResponses.find(function(element) {
        return element["type"]==="professors" && element["id"]=== course.relationships.instructor.data["id"];
      });
      sessions.push(this.buildCreateLabsessionFromJson(dataResponse, course, prof));

    }
    debugger
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


  private buildCreateLabsessionFromJson(s: LabsessionResponseData, a: IncludedCourseResponseData, b: IncludedProfessorResponseData ) : LabSession {
    let l = new LabsessionResponse(s);
    let c = new IncludedCourseResponse (a);
    let d = new IncludedProfessorResponse (b);

    let prof = new User(d.Email, d.Username, d.FirstName, d.LastName, d.Type,d.Id);
    let course = new Course(c.Subject, c.Number, c.Title, c.Semester, prof, c.Id);
    let session = new LabSession(l.Description, l.StartDate, l.EndDate, course);
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

  createNewLabSessionFromJson(r: LabsessionResponseData, includedResponses:any[]): LabSession{
    var course: IncludedCourseResponseData = includedResponses.find(function(element) {
      return element["type"] === "courses" && element["id"]=== r.attributes["course_id"];
    });

    //search for the professor information
    var prof : IncludedProfessorResponseData = includedResponses.find(function(element) {
      return element["type"]==="professors" && element["id"]=== course.relationships.instructor.data["id"];
    });

    let l = new LabsessionResponse(r);
    let c = new IncludedCourseResponse (course);
    let d = new IncludedProfessorResponse (prof);

    let professor = new User(d.Email, d.Username, d.FirstName, d.LastName, d.Type,d.Id);
    let inclCourse = new Course(c.Subject, c.Number, c.Title, c.Semester, professor, c.Id);
    let session = new LabSession(l.Description, l.StartDate, l.EndDate, inclCourse, l.Id, l.Token);
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

  private extractSessionId(r: sessionResponseData): number {
    let s = new sessionResponse(r);
    this.sessionId = s.SessionId;
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
