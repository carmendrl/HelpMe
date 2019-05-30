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


class LabsessionResponseAttributes {
  public description : string;
  public token : string;
  public activeStatus : boolean;
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
  public type : string;
  public id : number;
  public attributes: LabsessionResponseAttributes;
  public relationships : LabsessionResponseRelationships;
}

class LabsessionResponse {
  constructor (private data : LabsessionResponseData) {
  }
  get Type() : string { return this.data.type }
  get Id() : number { return this.data.id }
  get Description() : string { return this.data.attributes["description"] }
  get Token() : string { return this.data.attributes["token"] }
  get ActiveStatus() : boolean { return this.data.attributes["active"] }
  get StartDate() : Date { return this.data.attributes["start-date"]}
  get EndDate() : Date { return this.data.attributes["end-date"]}
  get CourseId() : number { return this.data.attributes["course-id"]}
  get Rdata() : string[] { return this.data.relationships.questions["data"]}
  get userId() : number {return this.data.relationships.users.data["id"]}
  get userType() : string { return this.data.relationships.users.data["type"]}
}


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

class IncludedProfessorResponse{
  constructor (private data: IncludedProfessorResponseData){
  }
  get Id() : number { return this.data.id }
  get Type() : string { return this.data.type }
  get Email() : string { return this.data.attributes["email"]}
  get Username() : string {return this.data.attributes["username"]}
  get Role() : string {return this.data.attributes["role"]}
  get FirstName() : string {return this.data.attributes["first-name"]}
  get LastName() : string {return this.data.attributes["last-name"]}

}

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

@Injectable()
export class LabSessionService {
  private apiHost : string;
  public _newLabSession$: Subject<LabSession>;

  constructor(private httpClient : HttpClient,@Inject(API_SERVER) host : string) {
    this.apiHost = host;
    this._newLabSession$ = new Subject<LabSession>();
  }

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
        return element["type"] === "courses" && element["id"]=== dataResponse.attributes["course-id"];
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
    let url : string =`${this.apiHost}/lab_sessions/`;
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
      return element["type"] === "courses" && element["id"]=== r.attributes["course-id"];
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




  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead


      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
