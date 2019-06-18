import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { User } from '../../models/user.model';
import { Observable, interval, Subscription, timer } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit, OnDestroy {
  private currentQuestion : Question;
  closeResult: string;
  saved : boolean = false;
  blured = false;
  focused = false;
  lastSavedTime:string;
  sub : Subscription;
  private user : User;


  constructor(private activeModal: NgbActiveModal, private questionService: QuestionService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    debugger
    //this.autoSave(this.currentQuestion.answer.submitted);
    this.save();
  }

  ngOnDestroy(){
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
  }

  save(){
    this.sub = timer(7000).subscribe(() => this.autoSave(this.currentQuestion.answer.submitted));
  }

  time(){
    this.lastSavedTime = moment().format('LTS');
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
