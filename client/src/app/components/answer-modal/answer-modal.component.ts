import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { Observable } from 'rxjs/Observable';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { Title }     from '@angular/platform-browser';


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

  constructor(private activeModal: NgbActiveModal, private questionService: QuestionService, private modalService: NgbModal,
              private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Add Answer - Help Me');
    this.FaQ = false;
  }

  ngOnDestroy(){
    this.titleService.setTitle('Session View - Help Me');
  }

  createAnswerFromForm(){
    this.saved = true;
    this.questionService.answerAQuestion(this.currentQuestion, this.text).subscribe(r => this.activeModal.close());
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
        debugger
        this.questionService.updateQuestion(this.currentQuestion, this.currentQuestion.text, true).subscribe();
      }
    }
}
