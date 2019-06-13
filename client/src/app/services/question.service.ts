import { Injectable, Inject } from '@angular/core';
import { Question } from '../models/question.model';
import { LabSession } from '../models/lab_session.model';
import { LabSessionService } from './labsession.service';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Answer } from '../models/answer.model';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
//import { SafeHtml } from '@angular/platform-browser';

@Injectable()
export class QuestionService {
  private apiHost : string;
  private userQuestions : Question[];
  private sessionId : string;
  public updatedQuestion$ : Subject<Question>;
  public newAnswer$ : Subject<Answer>;

  constructor(private httpClient : HttpClient, private labsessionService: LabSessionService, private route:ActivatedRoute) {
    this.apiHost = environment.api_base;
    this.updatedQuestion$ = new Subject<Question>();
    this.newAnswer$ = new Subject<Answer>();
    this.sessionId = this.route.snapshot.paramMap.get('id');
  }

  get getUpdatedQuestion$() : Observable<Question> {
    return this.updatedQuestion$;
  }

  get getNewAnswer$() : Observable<Answer> {
    return this.newAnswer$;
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

        var asker : Object = includedResponse.find(function(element) {
          return element["id"]=== object["relationships"]["original_asker"]["data"]["id"];
        });

        if (object["relationships"]["answer"] != undefined) {
          var answer: Object = includedResponse.find(function(element) {
            return element["type"]==="answers" && element["id"]=== object["relationships"]["answer"]["data"]["id"];
          });
          var answerer: Object = includedResponse.find(function(element) {
            return element["id"]=== answer["relationships"]["answerer"]["data"]["id"];
          });
        }else{
          var answer: Object = undefined;
          var answerer: Object = undefined;
        }

        if (object["relationships"]["claimed_by"] != undefined) {
          var claimer: Object = includedResponse.find(function(element) {
            return element["id"]=== object["relationships"]["claimed_by"]["data"]["id"];
          });
        }else{
          var claimer: Object = undefined;
        }
        if (object["relationships"]["askers"] != undefined) {
          var askers = new Array<Object>();
          for (let d of object["relationships"]["askers"]["data"]){
            var a: Object =includedResponse.find(function(element) {
              return element["id"]=== d["id"];
            });
            askers.push(a);
          }
        }else{
          var askers: Object[] = undefined;
        }

        userQuestions.push(this.buildQuestion(object, session, prof, course, answer, asker, claimer, askers, answerer));
      }

      return userQuestions;
    }


    private buildQuestion (qData: Object, sData : Object, profData : Object, cData :Object,
      aData : Object, askerData:Object, claimerData: Object, askersData:Object[], answererData:Object) : Question{

        let prof = User.createFromJSon(profData);
        let c = Course.createFromJSon(cData);
        c.professor =prof ;
        let s = LabSession.createFromJSon(sData);
        s.course = c;
        let asker = User.createFromJSon(askerData);
        let q = Question.createFromJSon(qData);
        q.session=s;
        q.asker=asker;
        if(aData != undefined){
          let answerer = User.createFromJSon(answererData);
          let a = Answer.createFromJSon(aData);
          a.user = answerer;
          a.session=s;
          q.answer=a;
        }
        if(claimerData != undefined){
          let claimer = User.createFromJSon(claimerData);
          q.claimedBy = claimer;
        }
        if(askersData != undefined){
          q.otherAskers = new Array<User>();
          for (let a of askersData){
            let otherAsker = User.createFromJSon(a);
            q.otherAskers.push(otherAsker);
          }
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
      unclaimAQuestion(question: Question): Observable<Question>{
        let url:string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}`;
        let user = new User();
        let body = {
          text : question.text,
          faq : question.faq,
          claimed_by_id: "",
          status: "pending"
        };
        return this.httpClient.put(url, body).pipe(
          map(r => {question.claimedBy=undefined;question.status="pending";return question;}),
          tap(r => this.updatedQuestion$.next(r)),
          catchError(this.handleError<Question>(`unclaim id=${question.id}`))
        );
      }


      answerAQuestion(question: Question, text: string): Observable<Answer>{
        let url : string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/answer`;
        let body = { text: text };
        var answerer:User;
        return this.httpClient.post(url, body).pipe(
          map(r => {answerer = User.createFromJSon(r["included"]);
          question.answer = (Answer.createFromJSon(r["data"]));
          question.answer.user = answerer; return question.answer }),
          tap(r => {this.updatedQuestion$.next(question); this.newAnswer$.next(r)}),
          catchError(this.handleError<Answer>(`answer created`))
        );
      }

      editAnAnswer(question: Question, text: string): Observable<Question>{
        let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/answer`;
        let body = {
          text : text
        };
        return this.httpClient.put(url, body).pipe(
          map(r => {question.answer.text = text; return question;}),
          tap(r => this.updatedQuestion$.next(r)),
          catchError(this.handleError<Question>(`answer edited`))
        );
      }

      addMeToo(question: Question, meToo: boolean, user: User) : Observable<Question>{
        let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/askers`;
        return this.httpClient.post(url, {}).pipe(
          map(r => {question.meToo = meToo; question.otherAskers.push(user); return question;}),
          tap(r => this.updatedQuestion$.next(r)),
          catchError(this.handleError<Question>(`meToo status changed=${question.id}`))
        );
      }

      askQuestion(text:string, session: string, step: number) : Observable<Question>{
        let url: string = `${this.apiHost}/lab_sessions/${session}/questions`;
        let body = {
          text : text,
          step: step
        };
        return this.httpClient.post(url, body).pipe(
          map(r => Question.createFromJSon(r["data"])),
          catchError(this.handleError<Question>(`question created`))
        );
      }


    assignQuestion(user: User, question: Question): Observable<Question>{
      let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/assign`;
      return this.httpClient.post(url, {user_id: user.id}).pipe(
        map(r => {question.claimedBy = user; return question;}),
        tap(r => this.updatedQuestion$.next(r)),
        catchError(this.handleError<Question>(`assigned =${question.id}`))
      )
    }

    findQuestionByText (text : string) : Observable <Question[]>{
      debugger
      let url: string = `${this.apiHost}/user/questions`;
      return this.httpClient.get(url).pipe(
        map(r => this.createArray(r['data'], r['included'])),
        catchError(this.handleError<Question[]>(`getSessionQuestions`))
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
