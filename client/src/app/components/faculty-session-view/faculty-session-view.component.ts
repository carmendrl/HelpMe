import { Component, OnInit, Input, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-faculty-session-view',
  templateUrl: './faculty-session-view.component.html',
  styleUrls: ['./faculty-session-view.component.scss']
})
export class FacultySessionViewComponent extends SessionView implements OnInit{
  private unclaimedQs: Question[];
  private myQs: Question[];
  private faQs: Question[];
  private otherQs:  Question[];
  private currentQuestion: Question;
  private currentDate: Date;
  private user: User;
  private token : string;
  private description:string;
  private subjectAndNumber:string;
  currentTime: Date;
  closeResult: string;
  private unclaimedQHeader:string = "Unclaimed Questions";
  private myQHeader:string = "My Questions";
  private faqHeader:string = "Frequently Asked Questions";
  private otherQHeader:string = "Other Questions";
  private claimedCollapsed:boolean = true;
  private copying: number;
  private playSound: boolean;
  private ended: boolean;


  private errorSession: ApiResponse<LabSession>;
  private loadedSession: LabSession;
  private sessionMessage: string[];
  private loadSessionError: boolean;


  @ViewChild('myonoffswitch',{static: false}) private audioSwitch;
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
    }

      ngOnInit() {
        this.playSound = true;
        this.questionService.getUpdatedQuestion$.subscribe(r =>
           { this.checkNotification(this.questions, {});
             //empty object passed in (because claimButton wasn't pressed)
             this.sortQuestions(this.questions)});
         this.getSessionCodeAndDescription();
         this.titleService.setTitle(`Session View - Help Me`);
         this.checkIfEnded();
      }

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
                          if(this.playSound){this.audioService.playProfessorAudio();}
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
                        if(this.playSound){this.audioService.playProfessorAudio();}
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
          if(this.playSound){this.audioService.playProfessorAudio();}
          this.notifier.notify('info', 'A new question has been posted!');
        }
      }



      sortQuestions(questions: Question[]){
        this.currentDate=new Date();
        //clears the array
        this.faQs.length = 0;
        this.otherQs.length = 0;
        this.unclaimedQs.length = 0;
        this.myQs.length= 0;

        for (let question of questions){
            if(question.isAnswered){
              if (question.faq){
                this.faQs.push(question);
              }
              else{
                this.otherQs.push(question);
              }
            }
            //how this is implemented this depends on how the assinged/claimed/pending variables look
            //as a part of the question model
            //right now assuming that questions would have the the id of the user that
            //claimed/got assigned the question and would be compared to the current user's id.
            else if(question.claimedBy != undefined && question.claimedBy.id != undefined){
              if(question.claimedBy.id === this.currentUser.id){
                this.myQs.push(question);
              }
              else if(question.claimedBy.id === ""){
                //this else-if statement puts the question back the unclaimedQs
                //if it was previous claimed and then unclaimed.
                this.unclaimedQs.push(question);
              }
              else{
                question.answer = new Answer();
                this.otherQs.push(question);
              }
            }
            else{
              this.unclaimedQs.push(question);
            }
        }
      }
      setEndDate(){
        this.currentTime = moment().utc().toDate();
        this.sessionService.updateEndDate(this.sessionId, this.currentTime).subscribe();
      }

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
            this.getSessionError(r);
          });

        }

      getSessionCodeAndDescription(){
        this.sessionService.getSession(this.sessionId).subscribe(session =>
          {this.token = session.Data.token,
            this.subjectAndNumber = session.Data.course.subjectAndNumber,
            this.description = session.Data.description, this.getSessionError(session)});
      }

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

      open(content) {
        let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-search-sessions'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

      }
      open2(content2) {
        let modal= this.modalService.open(content2, <NgbModalOptions>{ariaLabelledBy: 'modal-search-previous-questions'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

      }

      private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return  `with: ${reason}`;
        }
      }


      toggleAudio():boolean{
        this.audioSwitch.nativeElement.checked? this.playSound = true: this.playSound = false;
        return this.playSound;
      }

      scrollToClaimedQ():boolean{
        //When a claim action is performed, this method should relatively scroll to that question in teh MyQs lists
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

    }
