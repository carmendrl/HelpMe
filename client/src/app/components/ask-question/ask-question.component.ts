import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ContentChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../../models/question.model';
import { Answer } from '../../models/answer.model';
import { QuestionService } from '../../services/question.service';
import { BrowserModule, DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
	private possibleMatches: Question[] = new Array<Question>(); //list of matching questions
	private step: string; //the step that the question is on
	private faq: boolean = false; //is it a frequently asked question?
	private questionMessage: string;//the text of the question
	private message: SafeHtml;
	private answer: Answer;//the answer to the question
	private openAsk: boolean = false; //must start with opposite value as questionFormNotOpen in student-session-view.component
	private toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],
		[{ 'header': 1 }, { 'header': 2 }],
		[{ 'size': ['small', 'large', 'huge'] }],
		[{ 'color': [] }],
		['link', 'image', 'video']
	];

	@Input() session: string; //holds the ID of the current session

	private editorContentChanged$: Subject<string>; //listens to see when the contents of the quill editor change

	private editor: any; //holds the text editor object

	@Output() public refreshEvent: EventEmitter<any> = new EventEmitter(); //outputs when the page refreshs
	@Output() public pauseRefresh: EventEmitter<any> = new EventEmitter(); //outputs when the refresh is paused
	@Output() public questionFormEvent: EventEmitter<any> = new EventEmitter(); //outputs when question form is used

	constructor(private modalService: NgbModal, private questionService: QuestionService, private sanitizer: DomSanitizer) {
		this.editorContentChanged$ = new Subject<string>();
	}

	ngOnInit() {
		//when the content in the editor changes, look for matching questions again
		this.editorContentChanged$.pipe(
			debounceTime(200),
			distinctUntilChanged()
			//  Uncomment if we want to be sure to only have more than 1 word included
			//  in question when searching for matches
			// filter (text => text.trim().split(" ").length > 1)
		).subscribe(text => this.lookForMatchingQuestions(text));
	}

	//looks for questions that are similar to the one being asked
	private lookForMatchingQuestions(text: string) {
		console.log(text);
		this.questionService.findMatchingQuestions(this.session, text, String(this.step)).pipe(
			tap(response => response.Data.forEach(e => console.log(e)))
		).subscribe(
			response => this.possibleMatches = response.Data
		);

	}

	open(content) {
		//refresh is paused
		this.setPauseRefresh(true);

		let modal = this.modalService.open(content, <NgbModalOptions>{ ariaLabelledBy: 'modal-ask-question' }).result.then(
			(result) => {
				this.reset();
				this.setPauseRefresh(false);
			},
			(reason) => {
				this.reset();
				this.setPauseRefresh(false);
			});
	}

	created(editor: any): void {
		this.editor = editor;
	}

	//creates a new question and refreshs the page
	createQuestion() {
		this.questionService.askQuestion(this.questionMessage, this.session, this.step, this.editor.getText(), this.faq, this.answer).subscribe(
			r => { this.setPauseRefresh(false); this.refreshData({}) }); //passes in empty object to refreshData
	}
	//turns the automatic refresh on
	refreshData(r) {
		this.refreshEvent.next(r);
	}

	//paused the automatic refresh
	setPauseRefresh(r: boolean) {
		this.pauseRefresh.next(r);
	}

	toggleQuestionForm(r: boolean) {
		this.questionFormEvent.next(r);
	}
	toggleQuestionFormForMeToo() {
		//refreshData must be called before we collapse the form
		//so that the subscriber is still available
		this.refreshData({}); //passes in empty object to refreshData
		this.openAsk = false;
		this.toggleQuestionForm(this.openAsk);
		this.reset();
	}
	//sends an event when the content of the text editor changes
	private editorContentChanged(event) {
		this.editorContentChanged$.next(event.text);
	}

	//resets the form
	reset() {
		this.step = undefined;
		this.questionMessage = "";
		this.possibleMatches = [];
	}


}
