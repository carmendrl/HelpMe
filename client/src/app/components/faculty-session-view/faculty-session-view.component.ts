import { Component, OnInit, Input } from '@angular/core';
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
import { LabSession } from '../../models/lab_session.model';
import { QuestionListComponent } from '../question-list/question-list.component';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

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
  private copying: number;


  constructor(userService: UserService, questionService: QuestionService,
    route: ActivatedRoute, location: Location, notifierService: NotifierService, sessionService:LabSessionService, private modalService: NgbModal) {
      super(userService, questionService, route, location, notifierService, sessionService);
      this.unclaimedQs = new Array<Question>();
      this.myQs = new Array<Question>();
      this.faQs = new Array<Question>();
      this.otherQs = new Array<Question>();
      this.currentDate = new Date();
      this.userService.CurrentUser$.subscribe(r => this.user = r);
      this.copying = this.sessionService.copyQuestions.length;
    }

      ngOnInit() {
        this.questionService.getUpdatedQuestion$.subscribe(r =>
           { this.checkNotification(this.questions);
             this.sortQuestions(this.questions)});
         this.getSessionCodeAndDescription();
      }

      checkNotification(datas : Question[]){
        for (let data of datas){
          if(this.data){
          for (let q of this.data){
            if (q.id === data.id){
              if (q.claimedBy === undefined || q.claimedBy.id!= this.user.id){
                if(data.claimedBy.id != undefined){
                if (data.claimedBy.id === this.user.id){
                  this.notifier.notify('info', 'You have been assigned a question!');
                }
              }
              }
            }
          }
        }
      }
      if (this.data && datas.length > this.data.length){
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
        //debugger
        this.sessionService.updateEndDate(this.sessionId, this.currentTime).subscribe();
      }
      assign(question: Question, user: User){
        question.claimedBy = user;
      }

      delete(question: Question){
      }

      getSessionCodeAndDescription(){
        this.sessionService.getSession(this.sessionId).subscribe(session =>
          {this.token = session.token,
            this.subjectAndNumber = session.course.subjectAndNumber,
            this.description = session.description});
      }

      open(content) {
        let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-search-sessions'}).result.then((result) => {
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
    }
