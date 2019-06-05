import { Component, OnInit, Input } from '@angular/core';
<<<<<<< HEAD:client/src/app/answer-button/answer-button.component.ts
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question.model';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../models/answer.model';
=======
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
>>>>>>> 1fcd28184acafb2982707da6f5094b01f3b1432a:client/src/app/components/answer-button/answer-button.component.ts

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

  constructor(private questionService: QuestionService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  open(content){
    debugger
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
    debugger
    this.saved = true;
    this.questionService.answerAQuestion(this.currentQuestion, this.text).subscribe();
  }

}
