import { Question } from '../models/question.model';
import { ModelFactoryService } from './model-factory.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Injectable, Inject } from '@angular/core';
import { LabSessionService } from '../services/labsession.service';
import { API_SERVER } from '../app.config';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';
@Injectable()
export class QuestionService {

  private userQuestions : Question[];
  private sessionId: number;
  private apiHost : string;

  constructor(private _modelFactory: ModelFactoryService, private httpClient : HttpClient, private labsessionService: LabSessionService, @Inject(API_SERVER) host : string) {
    this.userQuestions = new Array<Question> ();
    let question1 = new Question();
    question1.text = "How do I center an image on a page?";
    question1.answer = "You can use the max-auto Bootstrap class";
    question1.session = _modelFactory.labSession1;
    question1.date = new Date("January 9, 2018");

    let question2 = new Question();
    question2.text = "How come the template {user.name} doesn't work?";
    question2.answer = "In Angular templates two curly braces are used instead of one";
    question2.session = _modelFactory.labSession2;
    question2.date = new Date("January 11, 2018");

    this.userQuestions.push(question1);
    this.userQuestions.push(question2);

    this.apiHost = host;
  }

  get myQuestions() : Observable<Question[]> {
    return Observable.of(this.userQuestions);
  }


  getSessionQuestions() : Observable<Question[]>{
    this.sessionId = this.labsessionService.sessionId;
    let url: string = `${this.apiHost}/lab_sessions/${this.sessionId}/questions`;
    return this.httpClient.get(url).pipe(
      map(r => this.createQuestionsArray(r['data'])),
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
