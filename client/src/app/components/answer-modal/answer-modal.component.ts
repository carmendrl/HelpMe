import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { Observable, interval, Subscription, timer } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-answer-modal',
	templateUrl: './answer-modal.component.html',
	styleUrls: ['./answer-modal.component.scss']
})
export class AnswerModalComponent implements OnInit, OnDestroy {
	@Input() private currentQuestion: Question;

	saved: boolean = false; //is the draft saved?
	text: string; //holds the text of the answer

	//used to format the quill text editor
	blured = false;
	focused = false;

	private FaQ: boolean; //is the FAQ box checked?
	lastSavedTime: string;
	sub: Subscription;
	private user: User;

	//formats the toolbar in teh quill editor
	private toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],
		[{ 'header': 1 }, { 'header': 2 }],
		[{ 'size': ['small', 'large', 'huge'] }],
		[{ 'color': [] }],
		['link', 'image', 'video']
	];

	constructor(private activeModal: NgbActiveModal, private userService: UserService, private questionService: QuestionService, private modalService: NgbModal,
		private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle('Add Answer - HelpMe'); //change the title of the page
		this.FaQ = false;
		this.save()
	}

	ngOnDestroy() {
		this.titleService.setTitle('Session View - HelpMe'); //change the title of the page back
		if (environment.production) {
			this.sub.unsubscribe();
		}
	}

	//creates an Answer object from the information in the form and closes the modal
	createAnswerFromForm(submitted: boolean) {
		if (environment.production) {
			this.sub.unsubscribe();
		}
		this.questionService.answerAQuestion(this.currentQuestion, this.text, submitted).subscribe(r => {
			this.activeModal.close();
		});
		this.addToFaQs(); //add to FAQs it this.FaQ is true
	}

	//automatically saves a draft
	autoSave(submitted: boolean) {
		this.questionService.answerAQuestion(this.currentQuestion, this.text, submitted).subscribe(r => {
			this.save(); this.time();
		});
	}

	//saves a draft
	//only autoSaves if in production mode
	save() {
		if (environment.production) {
			this.sub = timer(7000).subscribe(() => this.autoSave(this.currentQuestion.answer.submitted));
		}
	}

	//set the last saved time to the current time
	time() {
		this.lastSavedTime = moment().format('LTS');
	}

    /* Next three methods where taken from the quill editor example from the ngx-quill website
    https://www.npmjs.com/package/ngx-quill
    */

	//used to format quill editor
	created(event) {
		// tslint:disable-next-line:no-console
		console.log(event)
	}
	//used to format quill editor
	focus($event) {
		// tslint:disable-next-line:no-console
		console.log('focus', $event)
		this.focused = true
		this.blured = false
	}
	//used to format quill editor
	blur($event) {
		// tslint:disable-next-line:no-console
		console.log('blur', $event)
		this.focused = false
		this.blured = true
	}

	//adds the question to the FaQ list
	addToFaQs() {
		if (this.FaQ === true) {
			this.questionService.updateQuestion(this.currentQuestion, this.currentQuestion.text, true).subscribe();
		}
	}
}
