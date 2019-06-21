import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { Observable } from 'rxjs/Observable';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
<<<<<<< HEAD
import { Title }     from '@angular/platform-browser';


import { User } from '../../models/user.model';
import { Observable, interval, Subscription, timer } from 'rxjs';
import * as moment from 'moment';
=======

>>>>>>> parent of 7de0950... autoSave changes

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {
  private currentQuestion : Question;
  private answererId:string;
  closeResult: string;
  saved : boolean = false;
  blured = false;
  focused = false;

<<<<<<< HEAD
  constructor(private activeModal: NgbActiveModal, private questionService: QuestionService,
    private modalService: NgbModal, private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Edit Answer - Help Me');
    debugger
    //this.autoSave(this.currentQuestion.answer.submitted);
    this.save();
  }

  ngOnDestroy(){
    this.titleService.setTitle('Session View - Help Me');
    this.sub.unsubscribe();
  }

  isNotAStudent(){
      if (this.user.Type === "students"){
        return false;
      }
      else{
        return true;
      }
  }

  editAnswerFromForm(submitted:boolean){
    this.currentQuestion.answer.submitted = submitted;
    this.sub.unsubscribe();
    this.questionService.editAnAnswer(this.currentQuestion, this.currentQuestion.answer.text, submitted).subscribe(r => this.activeModal.close()
  );
  }

  autoSave(submitted:boolean){

    this.questionService.editAnAnswer(this.currentQuestion, this.currentQuestion.answer.text, submitted).subscribe(r => {
      console.log("In auto save");
      this.save(); this.time();
    });
=======
  constructor(private activeModal: NgbActiveModal, private questionService: QuestionService, private modalService: NgbModal) {
  }

  ngOnInit() {
>>>>>>> parent of 7de0950... autoSave changes
  }

  editAnswerFromForm(){
    this.saved = true;
    this.questionService.editAnAnswer(this.currentQuestion, this.currentQuestion.answer.text).subscribe(r => this.activeModal.close());
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
