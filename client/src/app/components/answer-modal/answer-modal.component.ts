import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { Observable } from 'rxjs/Observable';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';



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

  constructor(private activeModal: NgbActiveModal, private questionService: QuestionService, private modalService: NgbModal) { }

  ngOnInit() {
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
}
