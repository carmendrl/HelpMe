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


@Injectable()
export class QuestionService {
  private apiHost : string;
  private userQuestions : Question[];
  private sessionId : number;

  constructor(private httpClient : HttpClient, @Inject(API_SERVER) host : string, private labsessionService: LabSessionService) {
    this.apiHost = host;
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
        var answer: Object = includedResponse.find(function(element) {
          return element["type"]==="answers" && element["id"]=== object["relationships"]["answer"]["data"]["id"];
        });
        debugger
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
      let a = Answer.createFromJSon(aData);
      debugger
      a.session=s;
      let q = Question.createFromJSon(qData); //still need to add asker user
      q.session=s;
      q.answer=a;

      return q;

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
