import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { Title }     from '@angular/platform-browser';


import { User } from '../../models/user.model';
import { Observable, interval, Subscription, timer } from 'rxjs';
import * as moment from 'moment';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit, OnDestroy {
  private currentQuestion : Question;
  private answererId:string;
  closeResult: string;
  saved : boolean = false;
  blured = false;
  focused = false;
  lastSavedTime:string;
  sub : Subscription;
  private user : User;

  constructor(private activeModal: NgbActiveModal, private userService: UserService, private questionService: QuestionService,
    private modalService: NgbModal, private titleService: Title) {
      this.userService.CurrentUser$.subscribe(
        u => this.user = u);
  }

  ngOnInit() {
    this.titleService.setTitle('Edit Answer - Help Me');
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
    this.sub.unsubscribe();
    this.questionService.editAnAnswer(this.currentQuestion, this.currentQuestion.answer.text, submitted, this.user.id).subscribe(r => this.activeModal.close()
  );
  }

  autoSave(submitted:boolean){
    this.questionService.editAnAnswer(this.currentQuestion, this.currentQuestion.answer.text, submitted, this.user.id).subscribe(r => {
      this.save(); this.time();
    });
  }

  save(){
    if(environment.production){
      this.sub = timer(3000).subscribe(() => this.autoSave(this.currentQuestion.answer.submitted));
    }
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
