import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { UserService } from './services/user.service';
import { QuestionService } from './services/question.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Question } from './models/question.model';
import { User } from './models/user.model';
import { Observable, interval, Subscription, timer } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { LabSessionService } from './services/labsession.service';
import { AudioService } from './services/audio.service';
import { LabSession } from './models/lab_session.model';
import * as moment from 'moment';
import { ApiResponse } from './services/api-response';
import { environment } from '../environments/environment';


export abstract class SessionView  {
  questions: Question[];
  currentUser: User;
  protected data : any;
  private questionSubscription : Subscription;
  private timerSubscription : Subscription;
  protected sessionId: string;
  protected readonly notifier: NotifierService;
  protected timeFromRefresh: string;
  protected pauseRefresh: boolean;
  protected isRefreshing: boolean;
  //protected token: string;

  protected state: string;
  private getQuestions : Question[];
  private questionMessage : string[];
  private getQuestionsError: boolean;
  private errorGetQuestions: ApiResponse<Question[]>;

  constructor(protected userService : UserService, protected questionService: QuestionService,
    private route: ActivatedRoute, privatelocation: Location, protected notifierService: NotifierService,
    protected sessionService:LabSessionService, protected audioService: AudioService) {
    this.questionService.getSessionQuestions(this.route.snapshot.paramMap.get('id')).subscribe(
      questions => {this.questions = questions.Data; this.sortQuestions(questions.Data);this.handleGetQuestionsError(questions)});
      this.userService.CurrentUser$.subscribe(
        u => this.currentUser = u
      );
      this.pauseRefresh = false;
      this.sessionId = this.route.snapshot.paramMap.get('id');
      //this.token = this.route.snapshot.paramMap.get('token');
      this.refreshData({}); //empty object passed in
      this.notifier = notifierService;
    }

    //want to make this abstract method but must make this an abstract createNewLabSession
    //to make this an abstract class can't have a constructor because can't instantiate
    //an abstract class
    abstract sortQuestions(questions: Question[]); //may switch to specific user attribute such as type or id

    abstract checkNotification( data : any, r:any );//allows different notifications depending on the specific user


    private refreshData(r:any){
      //often an empty object will be passed in
      //only time an actual object will be passed in
      //is when the claimed button is pressed.
if(this.isRefreshing){
return;
}
else{
  this.isRefreshing =true;
      if(!(this.pauseRefresh)){
      this.questionSubscription = this.questionService.getSessionQuestions(this.route.snapshot.paramMap.get(
        'id')).subscribe(data => {
          this.checkNotification(data.Data, r);
          this.data = data.Data; this.sortQuestions(this.data);
          if(!(this.pauseRefresh)){
            this.subscribeToData();
            this.time();
          }
          this.handleGetQuestionsError(data);
        });
      }
      this.isRefreshing =false;
    }
      }

      //want to make this abstract method but must make this an abstract createNewLabSession
      //to make this an abstract class can't have a constructor because can't instantiate


        private subscribeToData(){
          if (environment.production) {
            this.timerSubscription = timer(3000).subscribe(() => this.refreshData({}));
            //empty object is passed into refreshData
          }
        }

        setPauseRefresh(r:boolean){
          this.pauseRefresh = r;

        }

        public ngOnDestroy(){
          if (this.questionSubscription){
            this.questionSubscription.unsubscribe();
          }
          if (this.timerSubscription){
            this.timerSubscription.unsubscribe();
          }
        }

        time(){
            this.timeFromRefresh = moment().format('LTS');
        }


        private handleGetQuestionsError(questions: ApiResponse<Question[]>){
          if(!questions.Successful){
            this.state = "errorGettingQuestions";
            this.errorGetQuestions = questions;
            this.getQuestions = <Question[]>questions.Data;
            this.questionMessage = questions.ErrorMessages;
            this.getQuestionsError = true;
          }
          else{
            this.state = "loaded";
            this.getQuestions = <Question[]>questions.Data;
          }
        }
      }
