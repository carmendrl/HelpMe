import { Injectable, Inject } from '@angular/core';
import { Question } from '../models/question.model';
import { ModelFactoryService } from './model-factory.service';
import { LabSession } from '../models/lab_session.model';
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
  get CreatedAt(): Date {return this.data.attributes["createdAt"]}
  get Status(): string {return this.data.attributes["status"]}
  get ReId(): number {return this.data.relationships.data["id"]}
  get ReType(): number {return this.data.relationships.data["type"]}
}

class QuestionResponseData{
  public id : number;
  public type : string;
  public attributes : QuestionResponseAttributes;
  public relationships : QuestionResponseRelationships;
}

class QuestionResponseAttributes{
  public text : string;
  public createdAt : Date;
  public status : string;
}

class QuestionResponseRelationships{
  public data: QuestionLabSessionData;
}

class QuestionLabSessionData{
  public id: number;
  public type: string;
}

class QuestionIncludedResponse{
  constructor(private data: QuestionResponseIncludedData){}
  get Id(): number {return this.data.id}
  get Type(): string {return this.data.type}
  get Description(): string {return this.data.attributes["description"]}
  get Token(): string {return this.data.attributes["token"]}
  get Active(): boolean {return this.data.attributes["active"]}
  get CourseId(): number {return this.data.attributes["courseId"]}
  get StartDate(): Date {return this.data.attributes["startDate"]}
  get EndDate(): Date {return this.data.attributes["endDate"]}
  get QId(): number {return this.data.relationships.questions.data["id"]}
  get QType(): string {return this.data.relationships.questions.data["type"]}
  get UId(): number {return this.data.relationships.users.data["id"]}
  get UType(): string {return this.data.relationships.users.data["type"]}
  get CId(): number {return this.data.relationships.course.data["id"]}
  get CType(): string {return this.data.relationships.course.data["type"]}
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
  public courseId: number;
  public startDate: Date;
  public endDate: Date;
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

@Injectable()
export class QuestionService {
  private apiHost : string;
  private userQuestions : Question[];
  private _modelFactory: ModelFactoryService;

  constructor(private httpClient : HttpClient, @Inject(API_SERVER) host : string) {

    this.apiHost = host;
    this.userQuestions = new Array<Question> ();

    // let question1 = new Question();
    // question1.text = "How do I center an image on a page?";
    // question1.answer = "You can use the max-auto Bootstrap class";
    // question1.session = _modelFactory.labSession1;
    // question1.date = new Date("January 9, 2018");
    //
    // let question2 = new Question();
    // question2.text = "How come the template {user.name} doesn't work?";
    // question2.answer = "In Angular templates two curly braces are used instead of one";
    // question2.session = _modelFactory.labSession2;
    // question2.date = new Date("January 11, 2018");
    //
    // this.userQuestions.push(question1);
    // this.userQuestions.push(question2);
  }

// theQuestions() : Observable<Question[]>{
//   debugger
//   let url :string = `${this.apiHost}/user/questions/`;
//   return this.httpClient.get(url).pipe(
//     map(r=>this.createArray(r["data"])),
//     catchError(this.handleError<Question[]>(`questions`))
//   );
// }

private createArray(questionDatas : QuestionResponseData[]) : Question[]{
  debugger
  for(let questionData of questionDatas){
    this.userQuestions.push(this.buildQuestion(questionData));
  }
  return this.userQuestions;
}


private buildQuestion (a : QuestionResponseData) : Question{
  let q = new QuestionResponse(a);

  let question = new Question(q.CreatedAt, q.Text, q.Status, this._modelFactory.labSession1, q.Id);

  return question;
}

postNewQuestion(text : string): Observable<Question>{
  let url :string = `${this.apiHost}/lab_sessions/:lab_session_id/questions`;
  let body={
    text: text
  };
  return this.httpClient.post(url, body).pipe(
    map(r=>this.buildQuestion(r["data"])),
    catchError(this.handleError<Question>(`accessingSession`))
  );
}

// getSessionid(text: string){
//   let url : string = `${this.apiHost}/lab_sessions/:lab_session_id/questions`;
//
// }



  get myQuestions() : Observable<Question[]> {
    // let url :string = `${this.apiHost}/user/questions`;
    // return this.httpClient.get(url).pipe(
    //   map(r=>this.createArray(r["data"])),
    //   catchError(this.handleError<Question[]>(`questions`))
    return Observable.of(this.userQuestions);
//  );
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
