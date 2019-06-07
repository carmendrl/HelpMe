import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';



@Component({
  selector: 'app-answer-button',
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.scss']
})
export class AnswerButtonComponent implements OnInit {
  @Input() private currentQuestion : Question;
    closeResult: string;
    saved : boolean = false;
    text : string;
    blured = false;
    focused = false;

  constructor(private questionService: QuestionService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  open(content){
    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-answer'}).result.then((result) => {
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

  createAnswerFromForm(){
    this.saved = true;
    this.questionService.answerAQuestion(this.currentQuestion, this.text).subscribe();
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
