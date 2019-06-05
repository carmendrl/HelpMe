import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';


@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent implements OnInit {
  @Input() private currentQuestion : Question;
  closeResult: string;
  saved : boolean = false;

  constructor(private questionService: QuestionService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  open(content){
    let modal = this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-edit-answer'}).result.then((result) => {
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

  editAnswerFromForm(){
    this.saved = true;
    this.questionService.editAnAnswer(this.currentQuestion, this.currentQuestion.answer.text).subscribe();
  }
}
