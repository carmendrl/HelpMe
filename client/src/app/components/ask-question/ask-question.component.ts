import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ContentChild } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../../models/question.model';
import { Answer } from '../../models/answer.model';
import { QuestionService } from '../../services/question.service';
import {BrowserModule, DomSanitizer, SafeHtml} from '@angular/platform-browser';
//import {QuillEditorComponent} from '../../../../node_modules/ngx-quill/src/quill-editor.component';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnInit {
  closeResult: string;
  private possibleMatches: Question[] = new Array<Question>();
  private step: string;
  private faq: boolean = false;
  private questionMessage: string;
  private message: SafeHtml;
  private answer: Answer;
  private openAsk: boolean = false; //must start with opposite value as questionFormNotOpen in student-session-view.component
  private toolbarOptions = [
    ['bold','italic', 'underline', 'strike'],
    [{'header': 1}, {'header': 2}],
    [{'size':['small', 'large', 'huge']}],
    [{'color':[]}],
    ['link','image','video']
  ];

  @Input() session: string;

	private editorContentChanged$ : Subject<string>;

	private editor : any;

  @Output() public refreshEvent: EventEmitter<any> = new EventEmitter();
  @Output() public pauseRefresh: EventEmitter<any> = new EventEmitter();
  @Output() public questionFormEvent: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private questionService: QuestionService, private sanitizer: DomSanitizer) {
		this.editorContentChanged$ = new Subject<string> ();
	}

  ngOnInit() {
		this.editorContentChanged$.pipe(
			debounceTime (200),
			distinctUntilChanged()
			//  Uncomment if we want to be sure to only have more than 1 word included
			//  in question when searching for matches
			// filter (text => text.trim().split(" ").length > 1)
		).subscribe (text => this.lookForMatchingQuestions (text));
	}

	private lookForMatchingQuestions (text : string) {
		console.log(text);
		this.questionService.findMatchingQuestions (this.session, text, String(this.step)).pipe (
				tap(response => response.Data.forEach(e => console.log(e)))
			).subscribe(
			response => this.possibleMatches = response.Data
		);

	}

  open(content){
    //refresh is paused
    this.setPauseRefresh(true);

    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-ask-question'}).result.then(
			(result) => {
      	this.reset();
				this.setPauseRefresh(false);
    	},
			(reason) => {
      	this.reset();
				this.setPauseRefresh(false);
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
    this.questionService.askQuestion(this.questionMessage, this.session, this.step, this.editor.getText(), this.faq, this.answer).subscribe(
      r => {this.setPauseRefresh(false);this.refreshData({})}); //passes in empty object to refreshData
  }

  refreshData(r){
    this.refreshEvent.next(r);
  }

	created(event) {
		this.editor = event;
	}

	setPauseRefresh(r: boolean){
		this.pauseRefresh.next(r);
	}

  toggleQuestionForm(r:boolean){
    this.questionFormEvent.next(r);
  }
  toggleQuestionFormForMeToo(){
    //refreshData must be called before we collapse the form
    //so that the subscriber is still available
    this.refreshData({}); //passes in empty object to refreshData
    this.openAsk=false;
    this.toggleQuestionForm(this.openAsk);
    this.reset();
  }
	private editorContentChanged (event) {
		this.editorContentChanged$.next(event.text);
	}

    reset(){
      this.step = undefined;
      this.questionMessage = "";
			this.possibleMatches = [];
    }


}
