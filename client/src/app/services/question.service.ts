import { Injectable, Inject } from '@angular/core';
import { Question } from '../models/question.model';
import { ModelFactoryService } from './model-factory.service';
import { LabSession } from '../models/lab_session.model';
import { LabSessionService } from './labsession.service';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { API_SERVER } from '../app.config';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';

class QuestionResponse{
  constructor (private data: QuestionResponseData){}
  get Id(): number {return this.data.id}
  get Type(): string {return this.data.type}
  get Text(): string {return this.data.attributes["text"]}
  get CreatedAt(): Date {return this.data.attributes["created_at"]}
  get Status(): string {return this.data.attributes["status"]}
  get AskerId(): number {return this.data.relationships.original_asker.data["id"]}
  get AskerType(): string {return this.data.relationships.original_asker.data["type"]}
  get AskedById(): number {return this.data.relationships.asked_by.data["id"]}
  get AskedByType(): string {return this.data.relationships.asked_by.data["type"]}
  get LabId(): number {return this.data.relationships.lab_session.data["id"]}
  get LabType(): string {return this.data.relationships.lab_session.data["type"]}
}

class QuestionResponseData{
  public id : number;
  public type : string;
  public attributes : QuestionResponseAttributes;
  public relationships : QuestionResponseRelationships;
}

class QuestionResponseAttributes{
  public text : string;
  public created_at : Date;
  public status : string;
}

class QuestionResponseRelationships{
  public original_asker: OriginalAsker;
  public asked_by: AskedBy;
  public lab_session: QuestionLabSession;
}

class OriginalAsker{
  public data:QuestionOGAskerData;
}

class QuestionOGAskerData{
  public id: number;
  public type: string;
}
class AskedBy{
  public data:QuestionAskedByData[];
}

class QuestionAskedByData{
  public id: number;
  public type: string;
}

class QuestionLabSession{
  public data:QuestionLabSessionData;
}

class QuestionLabSessionData{
  public id: number;
  public type: string;
}

class QuestionIncludedResponse{
  constructor(private included: QuestionResponseIncludedData){}
  get Id(): number {return this.included.id}
  get Type(): string {return this.included.type}
  get Description(): string {return this.included.attributes["description"]}
  get Token(): string {return this.included.attributes["token"]}
  get Active(): boolean {return this.included.attributes["active"]}
  get Course_Id(): number {return this.included.attributes["course_id"]}
  get StartDate(): Date {return this.included.attributes["start_date"]}
  get EndDate(): Date {return this.included.attributes["end_date"]}
  get QId(): number {return this.included.relationships.questions.data["id"]}
  get QType(): string {return this.included.relationships.questions.data["type"]}
  get UId(): number {return this.included.relationships.users.data["id"]}
  get UType(): string {return this.included.relationships.users.data["type"]}
  get CId(): number {return this.included.relationships.course.data["id"]}
  get CType(): string {return this.included.relationships.course.data["type"]}
}

class QuestionResponseIncludedData{
  public id: number;
  public type: string;
  public attributes: QuestionIncludedAttributes;
  public relationships: QuestionIncludedRelationship;
}


class QuestionIncludedAttributes{
  public description: string;
  public token: string;
  public active: boolean;
  public course_id: number;
  public start_date: Date;
  public end_date: Date;
}

class QuestionIncludedRelationship{
  public questions : QuestionIncludedData;
  public users : QuestionIncludedUsers;
  public course :QuestionIncludedCourse;
}

class QuestionIncludedData{
  public data: QuestionStuff;
}

class QuestionStuff{
  public id: number;
  public type: string;
}

class QuestionIncludedUsers{
  public data : UserData;
}

class UserData{
  public id: number;
  public type: string;
}

class QuestionIncludedCourse{
  public data : CourseData;
}

class CourseData{
  public id: number;
  public type: string;
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
export class QuestionService {
  private apiHost : string;
  private userQuestions : Question[];
  private _modelFactory: ModelFactoryService;
  private sessionId : number;

  constructor(private httpClient : HttpClient, @Inject(API_SERVER) host : string, private labsessionService: LabSessionService) {

    this.apiHost = host;
    //this.userQuestions = new Array<Question> ();

  }

questionList() : Observable<Question[]> {
    let url :string = `${this.apiHost}/user/questions`;
    return this.httpClient.get(url).pipe(
      map(r=>this.createArray(r["data"], r["included"])),
      catchError(this.handleError<Question[]>(`questions`))
    );
    // return Observable.of(this.userQuestions);
  }

private createArray(questions : QuestionResponseData[], includedResponse : any[]) : Question[]{
  let userQuestions = new Array<Question> ();
debugger
  for(let object of questions){
    let lab_session_id = object.relationships["lab_session"].data['id'];
    let lab_session = includedResponse.find( e => e["type"] == 'lab_sessions' && e["id"] == lab_session_id);
    let course_id = lab_session['relationships']['course']["data"]["id"];
    var course: IncludedCourseResponseData = includedResponse.find(function(element) {
      return element["type"]==="courses" && element["id"]=== course_id;
    });

    var session : QuestionResponseIncludedData = includedResponse.find(function(element){
      return element["type"]==="lab_sessions" && element["id"]=== lab_session_id})

      var prof : IncludedProfessorResponseData = includedResponse.find(function(element) {
        return element["type"]==="professors" && element["id"]=== course.relationships.instructor.data["id"];
      });

    userQuestions.push(this.buildQuestion(object, session, prof, course));
debugger
  }
  debugger
  return userQuestions;
  debugger
}


private buildQuestion (a : QuestionResponseData, b : QuestionResponseIncludedData, c : IncludedProfessorResponseData, t :IncludedCourseResponseData) : Question{
  let q = new QuestionResponse(a);
  let s = new QuestionIncludedResponse(b);
  let d = new IncludedProfessorResponse (c);
  let h = new IncludedCourseResponse (t);

  let prof = new User(d.Email, d.Username, d.FirstName, d.LastName, d.Type,d.Id);
  let course = new Course (h.Subject, h.Number, h.Title, h.Semester, prof, h.Id);
  let session = new LabSession (s.Description, s.StartDate, s.EndDate, course);
  let question = new Question(q.CreatedAt, q.Text, q.Status, session, q.Id);

  return question;
}


  getSessionQuestions() : Observable<Question[]>{
    this.sessionId = this.labsessionService.sessionId;
    let url: string = `${this.apiHost}/lab_sessions/${this.sessionId}/questions`;
    return this.httpClient.get(url).pipe(
      map(r => this.createArray(r['data'], r['included'])),
      catchError(this.handleError<Question[]>(`getSessionQuestions id=${this.sessionId}`))
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
