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
import { ApiResponse } from './api-response';
import * as moment from 'moment';

@Injectable()
export class QuestionService {
  private apiHost : string; //the base of all urls
  private userQuestions : Question[];
  private sessionId : string;
  public updatedQuestion$ : Subject<Question>; //listens for when questions are updated
  public newAnswer$ : Subject<Answer>; //listens for when new answers are added to questions
  private timeDifference: string;

  constructor(private httpClient : HttpClient, private labsessionService: LabSessionService,
    private route:ActivatedRoute) {
<<<<<<< HEAD
      this.apiHost = environment.api_base;
      this.updatedQuestion$ = new Subject<Question>();
      this.newAnswer$ = new Subject<Answer>();
      this.sessionId = this.route.snapshot.paramMap.get('id');
    }
=======
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

  // updateSmallText(question: Question){
  //   let tempArray = new Array<Object>();
  //   this.timeDifference = moment(question.date).fromNow();
  //   tempArray.push(question.text);
  //   tempArray.push(JSON.parse('{"insert": this.timeDifference}'));
  //   //this.step = question.step;
  //   question.smallText = tempArray;
  // }

  questionList() : Observable<ApiResponse<Question[]>> {
    let url :string = `${this.apiHost}/user/questions`;
    let questions: Question[];
    return this.httpClient.get(url).pipe(
      map(r=>{
        questions = this.createQuestionArrayFromJson(r["data"], r["included"]);
        let response : ApiResponse<Question[]> = new ApiResponse<Question[]>(true, questions);
        return response;
    }),
      catchError(r => this.handleQuestionsError(r,questions))
    );
  }

  private createQuestionArrayFromJson(questionsData: any[], includedResponse : any[]) : Question[]{
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


    //get the observable updated question
    get getUpdatedQuestion$() : Observable<Question> {
      return this.updatedQuestion$;
    }

    //get the observable new answer
    get getNewAnswer$() : Observable<Answer> {
      return this.newAnswer$;
    }

    // updateSmallText(question: Question){
    //   let tempArray = new Array<Object>();
    //   this.timeDifference = moment(question.date).fromNow();
    //   tempArray.push(question.text);
    //   tempArray.push(JSON.parse('{"insert": this.timeDifference}'));
    //   //this.step = question.step;
    //   question.smallText = tempArray;
    // }

    //get a list of all of the users questions
    questionList() : Observable<ApiResponse<Question[]>> {
      let url :string = `${this.apiHost}/user/questions`;
      let questions: Question[];
      return this.httpClient.get(url).pipe(
        map(r=>{
          questions = this.createArray(r["data"], r["included"]);
          let response : ApiResponse<Question[]> = new ApiResponse<Question[]>(true, questions);
          return response;
        }),
        catchError(r => this.handleQuestionsError(r,questions))
      );
    }

    //create an array of questions when given a json response
    private createArray(questionsData: any[], includedResponse : any[]) : Question[]{
      let userQuestions = new Array<Question> ();

      for(let object of questionsData){

        let lab_session_id = object["relationships"]["lab_session"]["data"]["id"];
        //search for the labsession with the correct id from the included response
        let lab_session = includedResponse.find( e => e["type"] == "lab_sessions" && e["id"] == lab_session_id);
        let course_id = lab_session["relationships"]["course"]["data"]["id"];
        //search for the course with the correct id from the included response
        var course: Object = includedResponse.find(function(element) {
          return element["type"]==="courses" && element["id"]=== course_id;
        });
        //search for the correct labsession from the json response
        var session : Object = includedResponse.find(function(element){
          return element["type"]==="lab_sessions" && element["id"]=== lab_session_id});
          //search for the correct professor from the json response
          var prof : Object = includedResponse.find(function(element) {
            return element["type"]==="professors" && element["id"]=== course["relationships"]["instructor"]["data"]["id"];
          });
          //search for the correct asker from the json response
          var asker : Object = includedResponse.find(function(element) {
            return element["id"]=== object["relationships"]["original_asker"]["data"]["id"];
          });
          //if there is an answer then find it from the json response
          if (object["relationships"]["answer"] != undefined) {
            var answer: Object = includedResponse.find(function(element) {
              return element["type"]==="answers" && element["id"]=== object["relationships"]["answer"]["data"]["id"];
            });
            //if there is an answer then find the answer from the json response
            var answerer: Object = includedResponse.find(function(element) {
              return element["id"]=== answer["relationships"]["answerer"]["data"]["id"];
            });
          }else{ //if there is no answer then set answer and answerer as undefined
            var answer: Object = undefined;
            var answerer: Object = undefined;
          }

          //if questionis claimed then find the claimer from the json response
          if (object["relationships"]["claimed_by"] != undefined) {
            var claimer: Object = includedResponse.find(function(element) {
              return element["id"]=== object["relationships"]["claimed_by"]["data"]["id"];
            });
          }else{//if there is no claimer, set as undefined
            var claimer: Object = undefined;
          }
          //if there are multiple askers then find them
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
          //build the questions from the object created previously from the json response and add them onto a list
          //unshift places each new question at the front of the list
          userQuestions.unshift(this.buildQuestion(object, session, prof, course, answer, asker, claimer, askers, answerer));
        }

        return userQuestions;
      }


      //build a question from the objects extracted from the json response
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

        //get a list of the questions for a particular labsession
        getSessionQuestions(id : string) : Observable<ApiResponse<Question[]>>{
          let url: string = `${this.apiHost}/lab_sessions/${id}/questions`;
          var questions= new Array<Question>();
          return this.httpClient.get(url).pipe(
            map(r => {
              questions = this.createQuestionArrayFromJson(r['data'], r['included']);
              let response: ApiResponse<Question[]> = new ApiResponse<Question[]>(true, questions);
              return response;
            }),
            catchError(r => this.handleQuestionsError(r, questions))
          );
        }



        //deletes a question
        deleteAQuestion(question: Question): Observable<ApiResponse<boolean>>{
          let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}`;
          var deleted: boolean;
          return this.httpClient.delete(url).pipe(
            map(r => {
              deleted = true;
              let response: ApiResponse<boolean> = new ApiResponse<boolean>(true, deleted);
              return response;
            }),
            catchError(r => this.handleBooleanQuestionError(r,deleted))
          );
        }

        //add a tag to a spectific question
        //add tag feature does not work yet
        addATag(question: Question, text: string): Observable<ApiResponse<boolean>>{
          let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/tags`;
          var added: boolean = false;
          let body = {
            name: text
          };
          return this.httpClient.post(url, body).pipe(
            map(r => {
              added = true;
              let response: ApiResponse<boolean> = new ApiResponse<boolean>(true, added);
              return response;
            }),
            catchError(r => this.handleBooleanQuestionError(r, added))
          );

        }

        //change a question
        //can use this method to change the text or FaQ status
        updateQuestion(question: Question, text: string, faQ: boolean, plaintext? : string): Observable<ApiResponse<Question>>{
          let url:string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}`;
          let body = {
            text : text,
            faq : faQ
          };

          if (plaintext) {
            body["plaintext"] = plaintext
          }

          return this.httpClient.put(url, body).pipe(
            //non-updated question is returned, but because an Observable is returned,
            //it will trigger a refresh and the updated question/answer will be displayed
            map(r => {
              let response: ApiResponse<Question> = new ApiResponse<Question> (true, question);
              return response;
            }),
            catchError(r => this.handleQuestionError(r,question))
          );
        }

        //claims a question by setting the question's claimedBy to the current user and setting claimed to true
        //also changes the status to "claimed"
        claimAQuestion(question: Question): Observable<ApiResponse<Object>>{
          let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/claim`;
          var claimed: Object;
          return this.httpClient.post(url, {}).pipe(
            map(r => {

              claimed = {
                //return object that helps prevent notifications
                //when a user claims a question themselves
                question: question,
                claim: true,
              };
              let response : ApiResponse<Object> = new ApiResponse<Object>(true, claimed);
              return response;
            }),
            catchError(r => this.handleObjectQuestionError(r, claimed))
          );
        }


        //unclaims a question by setting claimedBy to "" and changing status to pending
        unclaimAQuestion(question: Question): Observable<ApiResponse<Question>>{
          let url:string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}`;
          let user = new User();
          let body = {
            text : question.text,
            faq : question.faq,
            claimed_by_id: "",
            status: "pending"
          };
          return this.httpClient.put(url, body).pipe(
            //non-updated question is returned, but because an Observable is returned,
            //it will trigger a refresh and the updated question/answer will be displayed
            map(r => {
              let response : ApiResponse<Question> = new ApiResponse<Question>(true);
              return response;
            }),
            catchError(r => this.handleQuestionError(r, question))
          );
        }

        //answers a question and sets the submitted value to true
        answerAQuestion(question: Question, text: string, saved: boolean): Observable<ApiResponse<Question>>{
          let url : string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/answer`;
          let body = {
            text: text,
            submitted: saved};
            var answerer:User;
            return this.httpClient.post(url, body).pipe(
              //non-updated question is returned, but because an Observable is returned,
              //it will trigger a refresh and the updated question/answer will be displayed
              map(r => {
                let response: ApiResponse<Question> = new ApiResponse<Question> (true, question);
                return response;
              }),
              catchError(r => this.handleQuestionError(r,question))
            );
          }

          //updates an answer to a question and changes the answererId to the id of the current user
          editAnAnswer(question: Question, text: string, saved: boolean, answererId:string): Observable<ApiResponse<Question>>{
            let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/answer`;
            let body = {
              text : text,
              submitted : saved,
              answerer_id: answererId
            };
            var answerer: User;
            return this.httpClient.put(url, body).pipe(
              //non-updated question is returned, but because an Observable is returned,
              //it will trigger a refresh and the updated question/answer will be displayed
              map(r => {
                question.answer.text = text;
                question.answer.submitted =saved;
                let response: ApiResponse<Question> = new ApiResponse<Question>(true, question);
                return response;
              }),
              catchError(r => this.handleQuestionError(r, question))
            );
          }

          //deletes a draft of an answer to a question
          deleteADraft(question:Question): Observable<ApiResponse<boolean>>{
            let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/answer`;
            return this.httpClient.delete(url).pipe(
              map(r => {
                let response: ApiResponse<boolean> = new ApiResponse<boolean>(true, true);
                return response;
              }),
              catchError(r => this.handleBooleanQuestionError(r, false))
            );
          }

          //me toos a question by adding then current user to the list of askers for that question
          addMeToo(question: Question, meToo: boolean, user: User) : Observable<ApiResponse<Question>>{
            let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/askers`;
            return this.httpClient.post(url, {}).pipe(
              map(r => {
                let response: ApiResponse<Question> = new ApiResponse<Question>(true, question);
                return response;
              }),
              catchError(r => this.handleQuestionError(r, question))
            );
          }

          //asks a new question and returns that question
          askQuestion(text:string, session: any, step: string, plaintext: string, faq: boolean, answer: Answer) : Observable<ApiResponse<Question>>{
            let url: string = `${this.apiHost}/lab_sessions/${session}/questions`;
            let quest = new Question();
            let lab = new LabSession();
            quest.session = lab;
            quest.text = text;
            quest.session.id = session;
            quest.step = step;
            quest.faq= faq;
            quest.answer = answer;
            let body = {
              text : text,
              step: step,
              faq: faq,
              answer: answer,
              plaintext: plaintext
            };
            return this.httpClient.post(url, body).pipe(
              map(r => {
                let quest: Question = Question.createFromJSon(r["data"]);
                let response: ApiResponse<Question> = new ApiResponse<Question> (true, quest);
                return response;
              }),
              catchError(r => this.handleQuestionError(r,quest))
            );
          }

          //makes a copy of a question and returns the copy
          copyQuestion (question : Question, toSession : LabSession) : Observable<ApiResponse<Question>> {
            let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/copy-to/${toSession.id}`;
            return this.httpClient.post(url, {}).pipe(
              map (r => {
                let response : ApiResponse<Question> = new ApiResponse<Question> (true);
                let newQuestion : Question = Question.createFromJSon(r["data"]);
                response.Data = newQuestion;
                return response;
              })
            );
            //  TODO  Add proper error handling for this code
          }
    findMatchingQuestions (lab_session_id: string, searchText : string, step: string) : Observable<ApiResponse<Question[]>>{
      let url: string = `${this.apiHost}/lab_sessions/${lab_session_id}/questions/matching?q=${searchText}`;
var questions: Question[];
      if (step != undefined && step != "undefined") {
        url = `${url}&step=${step}`
      }

      url = encodeURI(url);
      return this.httpClient.get(url).pipe(
        map(r => {
          questions = this.createQuestionArrayFromJson(r["data"], r["included"]);
          let response: ApiResponse<Question[]> = new ApiResponse<Question[]>(true, questions);
          return response;
        }),
        catchError(r => this.handleMatchingQuestionsError (r))
      );
    }

  	handleMatchingQuestionsError (response) : Observable<ApiResponse<Question[]>> {
  		let apiResponse : ApiResponse<Question[]> = new ApiResponse<Question[]> (false);
  		if (response instanceof HttpErrorResponse) {
  			apiResponse.addErrorsFromHttpError (<HttpErrorResponse> response);
  		}
  		else {
  			apiResponse.addError ("Unable to load potential matches");
  		}
  		return of(apiResponse);
  	}


          //assigns a question to another user and returns a question
          assignQuestion(user: User, question: Question): Observable<ApiResponse<Question>>{
            let url: string = `${this.apiHost}/lab_sessions/${question.session.id}/questions/${question.id}/assign`;
            return this.httpClient.post(url, {user_id: user.id}).pipe(
              //non-updated question is returned, but because an Observable is returned,
              //it will trigger a refresh and the updated question/answer will be displayed
              map(r => {
                let response: ApiResponse<Question> = new ApiResponse<Question>(true, question);
                return response;
              }),
              catchError(r => this.handleQuestionError(r, question))
            )
          }

          //used in searching to find questions that are similar, returns an array of questions
          findQuestionByText (text : string) : Observable<ApiResponse<Question[]>>{
            let url: string = `${this.apiHost}/user/questions`;
            var questions: Question[];
            return this.httpClient.get(url).pipe(
              map(r => {
                questions = this.createArray(r['data'], r['included']);
                let response: ApiResponse<Question[]> = new ApiResponse<Question[]>(true,questions);
                return response;
              }),
              catchError(r => this.handleQuestionsError(r, questions))
            );
          }


          //this section is for error handlers
          private handleQuestionsError(error: any, quest: Question[]) : Observable<ApiResponse<Question[]>>{
            let apiResponse: ApiResponse<Question[]> = new ApiResponse<Question[]> (false);
            apiResponse.Data = quest;
            if(error instanceof HttpErrorResponse){
              apiResponse.addErrorsFromHttpError(error);
            }
            else{
              apiResponse.addError("An unknown error occurred");
            }
            return of(apiResponse);
          }

          private handleBooleanQuestionError(error: any, deleted: boolean): Observable<ApiResponse<boolean>>{
            let apiResponse: ApiResponse<boolean> = new ApiResponse<boolean>(false);
            apiResponse.Data = deleted;
            if(error instanceof HttpErrorResponse){
              apiResponse.addErrorsFromHttpError(error);
            }
            else{
              apiResponse.addError(error);
            }
            return of(apiResponse);
          }

          private handleObjectQuestionError(error: any, object: Object): Observable<ApiResponse<Object>>{
            let apiResponse : ApiResponse<Object> = new ApiResponse<Object>(false);
            apiResponse.Data = object;
            if(error instanceof HttpErrorResponse){
              apiResponse.addErrorsFromHttpError(error);
            }
            else{
              apiResponse.addError("An unnknown error occured");
            }
            return of(apiResponse);
          }

          private handleQuestionError(error: any, question: Question): Observable<ApiResponse<Question>>{
            let apiResponse: ApiResponse<Question> = new ApiResponse<Question>(false);
            apiResponse.Data = question;
            if(error instanceof HttpErrorResponse){
              apiResponse.addErrorsFromHttpError(error);
            }
            else{
              apiResponse.addError(error);
            }
            return of(apiResponse);
          }
        }
