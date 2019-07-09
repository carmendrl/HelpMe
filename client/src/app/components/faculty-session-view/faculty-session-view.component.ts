import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { SessionView } from '../../session-view';
import { Question } from '../../models/question.model';
import { Answer } from '../../models/answer.model';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { LabSessionService } from '../../services/labsession.service';
import { AudioService } from '../../services/audio.service';
import { LabSession } from '../../models/lab_session.model';
import { QuestionListComponent } from '../question-list/question-list.component';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Title }     from '@angular/platform-browser';
import { ApiResponse } from '../../services/api-response';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-faculty-session-view',
  templateUrl: './faculty-session-view.component.html',
  styleUrls: ['./faculty-session-view.component.scss']
})
export class FacultySessionViewComponent extends SessionView implements OnInit{
  private unclaimedQs: Question[]; //list of unclaimed questions
  private myQs: Question[]; //list of the users questions
  private faQs: Question[]; //list of frenquently asked questions
  private otherQs:  Question[]; //list of all questions
  private currentQuestion: Question;
  private currentDate: Date;

  ///information to create a session
  private user: User; //the current user
  private token : string;
  private description:string;
  private subjectAndNumber:string;
  currentTime: Date;

  closeResult: string; //why was the modal closed

  //headers for the lists of questions
  private unclaimedQHeader:string = "Unclaimed Questions";
  private myQHeader:string = "My Questions";
  private faqHeader:string = "Frequently Asked Questions";
  private otherQHeader:string = "All Questions";

  private claimedCollapsed:boolean = true;
  private copying: number; //the number of questions that are copied
  private ended: boolean; //is the session ended?

  //used in error handling
  private sess: LabSession;
  private errorSession: ApiResponse<LabSession>;
  private loadedSession: LabSession;
  private sessionMessage: string[];
  private loadSessionError: boolean;

  public href: string = ""; //the url of the page, includes labsessiojn id

  @ViewChild('claimedQuestions',{static: false}) private claimedQuestions;

  constructor(userService: UserService, questionService: QuestionService, audioService: AudioService,
    route: ActivatedRoute, location: Location, notifierService: NotifierService,
    sessionService:LabSessionService, private titleService: Title, private modalService: NgbModal) {
      super(userService, questionService, route, location, notifierService, sessionService, audioService);
      this.unclaimedQs = new Array<Question>();
      this.myQs = new Array<Question>();
      this.faQs = new Array<Question>();
      this.otherQs = new Array<Question>();
      this.currentDate = new Date();
      this.userService.CurrentUser$.subscribe(r => this.user = r);
      this.copying = this.sessionService.copyQuestions.length;
      // this.sess = <LabSession>this.session;
    }

    ngOnInit() {
      //loads the session questions
      this.questionService.getUpdatedQuestion$.subscribe(r =>
        { this.checkNotification(this.questions, {});
        //empty object passed in (because claimButton wasn't pressed)
        this.sortQuestions(this.questions)});
        this.getSessionCodeAndDescription();
        this.titleService.setTitle(`Session View - Help Me`);
        this.checkIfEnded();
        //gets the current session and sets corresponsponing fields
        this.sessionService.getSession(this.sessionId).subscribe(sess => {this.session = sess; this.sess = <LabSession>this.session.Data;
          this.token = this.sess.token ;this.href = `${environment.server}/dashboard?token=${this.token}`;});


        }

        //display notifications depending on what action took place
        checkNotification(datas : Question[], r:any){
          if(r != undefined && r._data != undefined && r._data.question != undefined){
            //r.data.question is defined if and only if the claimButton was selected
            //in the "claim case" An ApiResponse<Object> is returned,
            //where the object has question and "claim" boolean attributes
            for (let data of datas){
              if(this.data && data.answer ===undefined){
                //must check that answer is undefined,
                //otherwise assigned notification will pop up even question has been answered
                //and is simply moving between lists (e.g. to/from FAQ)
                for (let q of this.data){
                  if (q.id === data.id){
                    if(q.id != r._data.question.id && data.id != r._data.question.id){
                      //this checks to make sure that the question is not the one
                      //that the user claimed themselves
                      if (q.claimedBy === undefined || q.claimedBy.id!= this.user.id){
                        if(data.claimedBy.id != undefined){
                          if (data.claimedBy.id === this.user.id){
                            this.audioService.playProfessorAudio();
                            this.notifier.notify('info', 'You have been assigned a question!');
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          else{
            //if any action other than claim was selected
            for (let data of datas){
              if(this.data && data.answer ===undefined){
                //must check that answer is undefined,
                //otherwise assigned notification will pop up even question has been answered
                //and is simply moving between lists (e.g. to/from FAQ)
                for (let q of this.data){
                  if (q.id === data.id){
                    if (q.claimedBy === undefined || q.claimedBy.id!= this.user.id){
                      if(data.claimedBy.id != undefined){
                        if (data.claimedBy.id === this.user.id){
                          this.audioService.playProfessorAudio();
                          this.notifier.notify('info', 'You have been assigned a question!');
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          if (this.data && datas.length > this.data.length){
            this.audioService.playProfessorAudio();
            this.notifier.notify('info', 'A new question has been posted!');
          }
        }


        //sort questions into respective lists
        sortQuestions(questions: Question[]){
          this.currentDate=new Date();
          //clears the lists of questions
          this.faQs.length = 0;
          this.otherQs.length = 0;
          this.unclaimedQs.length = 0;
          this.myQs.length= 0;

          for (let question of questions){
            if(question.isAnswered){ //question must be answered to be a FaQ
              if (question.faq){
                this.faQs.push(question);
              }
              else{
                this.otherQs.push(question);
              }
            }
            //how this is implemented this depends on how the assigned/claimed/pending variables look
            //as a part of the question model
            //right now assuming that questions would have the the id of the user that
            //claimed/got assigned the question and would be compared to the current user's id.
            else if(question.claimedBy != undefined && question.claimedBy.id != undefined){
              if(question.claimedBy.id === this.currentUser.id){
                this.myQs.push(question);
                this.otherQs.push(question); //push onto other questins because it holds all questions
              }
              else if(question.claimedBy.id === ""){
                //this else-if statement puts the question back the unclaimedQs
                //if it was previous claimed and then unclaimed.
                this.unclaimedQs.push(question);
                this.otherQs.push(question);
              }
              else{
                question.answer = new Answer();
                this.otherQs.push(question);
              }
            }
            else{
              this.unclaimedQs.push(question);
              this.otherQs.push(question);
            }
          }
          //so older questions appear on top
          this.unclaimedQs.reverse();
        }

        //set the endDate to the current date
        setEndDate(){
          this.currentTime = moment().utc().toDate();
          this.sessionService.updateEndDate(this.sessionId, this.currentTime).subscribe();
        }

        //check if the session has ended yet
        checkIfEnded(){
          this.currentDate = new Date();
          this.sessionService.getSession(this.sessionId).subscribe(
            r => {
              if(new Date(r.Data.endDate.toString()) <= this.currentDate){
                this.ended = true;
              }
              else{
                this.ended = false;
              }
              this.getSessionError(r); //handles error
            });

          }

          //get the current session token and description
          getSessionCodeAndDescription(){
            this.sessionService.getSession(this.sessionId).subscribe(session =>
              {this.token = session.Data.token,
                this.subjectAndNumber = session.Data.course.subjectAndNumber,
                this.description = session.Data.description, this.getSessionError(session)});
              }



              //sets why the modal was dismissed
              private getDismissReason(reason: any): string {
                if (reason === ModalDismissReasons.ESC) {
                  return 'by pressing ESC';
                } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
                  return 'by clicking on a backdrop';
                } else {
                  return  `with: ${reason}`;
                }
              }


              scrollToClaimedQ():boolean{
                //When a claim action is performed, this method should relatively scroll to that question in the MyQs lists
                //so that instructors can easily claim and then answer.
                //method many not be sufficient if professor has claimed more questions than fit on the screen
                this.claimedQuestions.nativeElement.scrollIntoView();
                this.claimedCollapsed = false;
                return this.claimedCollapsed;

              }

              changeCollapseState():boolean{
                //method used to control collapse state of My Questions question-list
                //(when either toggle button is clicked or a question is claimed)
                this.claimedCollapsed = !this.claimedCollapsed;
                return this.claimedCollapsed;
              }


              //handle errors
              private getSessionError(session: ApiResponse<LabSession>){
                if(!session.Successful){
                  this.state = "errorLoadingSession";
                  this.errorSession = session;
                  this.loadedSession = <LabSession>session.Data;
                  this.sessionMessage = session.ErrorMessages;
                  this.loadSessionError = true;
                }
                else{
                  this.state = "loaded";
                  this.loadedSession = <LabSession>session.Data;
                }
              }
            }
