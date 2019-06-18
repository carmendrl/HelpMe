import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import * as moment from 'moment';
import { Observable, interval, Subscription, timer } from 'rxjs';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-answer-modal',
  templateUrl: './answer-modal.component.html',
  styleUrls: ['./answer-modal.component.scss']
})
export class AnswerModalComponent implements OnInit {
  @Input() private currentQuestion : Question;
    closeResult: string;
    saved : boolean = false;
    text : string;
    blured = false;
    focused = false;
    lastSaved: string;
    sub : Subscription;
    private user : User;

  constructor(private activeModal: NgbActiveModal, private questionService: QuestionService, private modalService: NgbModal) { }

  ngOnInit() {
   //this.autoSave(this.currentQuestion.answer.submitted);
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
}
