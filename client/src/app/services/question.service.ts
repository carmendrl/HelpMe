import { Injectable, Inject } from '@angular/core';
import { Question } from '../models/question.model';
import { ModelFactoryService } from './model-factory.service';
import { LabSession } from '../models/lab_session.model';
import { LabSessionService } from './labsession.service';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Answer } from '../models/answer.model';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { API_SERVER } from '../app.config';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class QuestionService {
  private apiHost : string;
  private userQuestions : Question[];
  private sessionId : number;
  public updatedQuestion$ : Subject<Question>;

  constructor(private httpClient : HttpClient, @Inject(API_SERVER) host : string, private labsessionService: LabSessionService) {
    this.apiHost = host;
    this.updatedQuestion$ = new Subject<Question>();
  }

  get getUpdatedQuestion$() : Observable<Question> {
    return this.updatedQuestion$;
  }
  questionList() : Observable<Question[]> {
    let url :string = `${this.apiHost}/user/questions`;
    return this.httpClient.get(url).pipe(
      map(r=>this.createArray(r["data"], r["included"])),
      catchError(this.handleError<Question[]>(`questions`))
    );
  }

  private createArray(questionsData: any[], includedResponse : any[]) : Question[]{
    let userQuestions = new Array<Question> ();

    for(let object of questionsData){

      let lab_session_id = object["relationships"]["lab_session"]["data"]["id"];
      let lab_session = includedResponse.find( e => e["type"] == "lab_sessions" && e["id"] == lab_session_id);
      let course_id = lab_session["relationships"]["course"]["data"]["id"];
      var course: Object = includedResponse.find(function(element) {
        return element["type"]==="courses" && element["id"]=== course_id;
      });
      var session : Object = includedResponse.find(function(element){
        return element["type"]==="lab_sessions" && element["id"]=== lab_session_id});

        var prof : Object = includedResponse.find(function(element) {
          return element["type"]==="professors" && element["id"]=== course["relationships"]["instructor"]["data"]["id"];
        });

        if (object["relationships"]["answer"] != undefined) { var answer: Object = includedResponse.find(function(element) {
          return element["type"]==="answers" && element["id"]=== object["relationships"]["answer"]["data"]["id"];
        });
      }else{
        var answer: Object = undefined;
      }

        userQuestions.push(this.buildQuestion(object, session, prof, course, answer));
      }

      return userQuestions;
    }


    private buildQuestion (qData: Object, sData : Object, profData : Object, cData :Object, aData : Object) : Question{

      let prof = User.createFromJSon(profData);
      let c = Course.createFromJSon(cData);
      c.professor =prof ;
      let s = LabSession.createFromJSon(sData);
      s.course = c;
      let q = Question.createFromJSon(qData); //still need to add asker user
      q.session=s;
      if(aData != undefined){
          let a = Answer.createFromJSon(aData);
          a.session=s;
          q.answer=a;
      }
      return q;

    }

    getSessionQuestions(id : string) : Observable<Question[]>{
      let url: string = `${this.apiHost}/lab_sessions/${id}/questions`;
      return this.httpClient.get(url).pipe(
        map(r => this.createArray(r['data'], r['included'])),
        catchError(this.handleError<Question[]>(`getSessionQuestions id=${id}`))
      );
    }

    //deletes a question
    deleteAQuestion(question: Question): Observable<boolean>{
      let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}`;
      //let temp = question;
      return this.httpClient.delete(url).pipe(
        tap(r => {question.id = undefined; this.updatedQuestion$.next(question)}),
        map(r => true),
        catchError(this.handleError<boolean>(`delete question id=${question.id}`))
      );
      //return temp;
    }

    updateQuestion(question: Question, text: string, faQ: boolean): Observable<Question>{
      let url:string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}`;
      let body = {
        text : text,
        faq : faQ
      };
      return this.httpClient.put(url, body).pipe(
        map(r => {question.text = text; question.faq = faQ;return question;}),
        tap(r => this.updatedQuestion$.next(r)),
        catchError(this.handleError<Question>(`updateQuestion id=${question.id}`))
      );
    }

    claimAQuestion(question: Question): Observable<Question>{
      let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/claim`;
      return this.httpClient.post(url, {}).pipe(
          map(r => question.claimedBy = r["data"]["relationships"]["claimed_by"]["data"]),
          tap(r => this.updatedQuestion$.next(r)),
          catchError(this.handleError<Question>(`claim id=${question.id}`))
      );
    }

    answerAQuestion(question: Question, text: string): Observable<Answer>{
      let url : string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/answer`;
      let body = { text: text };
      return this.httpClient.post(url, body).pipe(
        map(r => question.answer = (Answer.createFromJSon(r["data"]))),
        tap(r => this.updatedQuestion$.next(question)),
        catchError(this.handleError<Answer>(`answer created`))
      );
    }

    editAnAnswer(question: Question, text: string): Observable<Question>{
      let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/answer/${question.answer.id}`;
      let body = {
        text : text
      };
      return this.httpClient.put(url, body).pipe(
        map(r => {question.answer.text = text; return question;}),
        tap(r => this.updatedQuestion$.next(r)),
        catchError(this.handleError<Question>(`answer edited id=${question.answer.id}`))
      );
    }

    addMeToo(question: Question, meToo: boolean) : Observable<Question>{
      let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/askers`;
      return this.httpClient.post(url, {}).pipe(
        map(r => {question.meToo = meToo; return question;}),
        tap(r => this.updatedQuestion$.next(r)),
        catchError(this.handleError<Question>(`meToo status changed=${question.answer.id}`))
      );
    }

    assignQuestion(user: User, question: Question): Observable<Question>{
      let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/assign`;
      return this.httpClient.put(url, {}).pipe(
        map(r => {question.claimedBy = user; return question;}),
        tap(r => this.updatedQuestion$.next(r)),
        catchError(this.handleError<Question>(`assigned =${question.id}`))
      )
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
