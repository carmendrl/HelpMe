import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import {BrowserModule, DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnInit {
  closeResult: string;
  private possibleMatches: Question[] = new Array<Question>();
  private step: string;
  private questionMessage: string;
  private message: SafeHtml;
  blured = false;
  focused = false;
  @Input() session: string;

  @Output() public refreshEvent: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private questionService: QuestionService, private sanitizer: DomSanitizer) {
}

  ngOnInit() {

}

  open(content){
    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-ask-question'}).result.then((result) => {
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

  createQuestion(){
    this.questionService.askQuestion(this.questionMessage, this.session, this.step).subscribe(
      r => this.refreshData());
  }

  refreshData(){
    this.refreshEvent.next();
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

    reset(){
      this.step = undefined;
      this.questionMessage = "";

    }



}
