import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { Title }     from '@angular/platform-browser';
import * as moment from 'moment';
import { Observable, interval, Subscription, timer } from 'rxjs';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-answer-modal',
  templateUrl: './answer-modal.component.html',
  styleUrls: ['./answer-modal.component.scss']
})
export class AnswerModalComponent implements OnInit, OnDestroy {
  @Input() private currentQuestion : Question;
    closeResult: string;
    saved : boolean = false;
    text : string;
    blured = false;
    focused = false;
    private FaQ: boolean;
    lastSaved: string;
    sub : Subscription;
    private user : User;

  constructor(private activeModal: NgbActiveModal, private userService: UserService, private questionService: QuestionService, private modalService: NgbModal,
              private titleService: Title) { }

  ngOnInit() {
  this.titleService.setTitle('Add Answer - Help Me');
  this.FaQ = false;
   //this.autoSave(this.currentQuestion.answer.submitted);
 }

 ngOnDestroy(){
   this.titleService.setTitle('Session View - Help Me');
 }


 isNotAStudent(){
 if (this.user.Type === "students"){
   return false;
 }
 else{
   return true
 }
 }

 createAnswerFromForm(submitted:boolean){
   this.saved = true;
   this.questionService.answerAQuestion(this.currentQuestion, this.text, submitted).subscribe(r => {this.activeModal.close();
 });
  this.addToFaQs();
 }

 autoSave(submitted:boolean){
   this.questionService.answerAQuestion(this.currentQuestion, this.text, submitted).subscribe(r => {
     this.save(); this.time();
   });
 }

 save(){
   this.sub = timer(10000).subscribe(() => this.autoSave(this.currentQuestion.answer.submitted));
 }

 time(){
   this.lastSaved = moment().format('LTS');
 }



    created(event) {
      // tslint:disable-next-line:no-console
      console.log(event)
    }

    focus($event) {
      // tslint:disable-next-line:no-console
      console.log('focus', $event)
      this.focused = true
      this.blured = false
    }

    blur($event) {
      // tslint:disable-next-line:no-console
      console.log('blur', $event)
      this.focused = false
      this.blured = true
    }

    addToFaQs(){
      if(this.FaQ===true){
        this.questionService.updateQuestion(this.currentQuestion, this.currentQuestion.text, true).subscribe();
      }
    }
}
