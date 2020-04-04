import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { Title } from '@angular/platform-browser';
import { User } from '../../models/user.model';
import { Observable, interval, Subscription, timer } from 'rxjs';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';


@Component({
	selector: 'app-edit-modal',
	templateUrl: './edit-modal.component.html',
	styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit, OnDestroy {
	private currentQuestion: Question;
	private answererId: string; //the ID of the answerer
	saved: boolean = false; //is the answer saved?

	//used in formatting the quill text editor
	blured = false;
	focused = false;

	lastSavedTime: string; //time when the answer was last saved
	sub: Subscription;
	private user: User; //the current user

	constructor(private activeModal: NgbActiveModal, private userService: UserService, private questionService: QuestionService,
		private modalService: NgbModal, private titleService: Title) {
		this.userService.CurrentUser$.subscribe(
			u => this.user = u);
	}

	ngOnInit() {
		this.titleService.setTitle('Edit Answer - Help Me');
		this.save(); //save the answer
	}

	ngOnDestroy() {
		this.titleService.setTitle('Session View - Help Me');
		if (environment.production && false) {
			this.sub.unsubscribe();
		}
	}

	//checks that the current user is not a student
	isNotAStudent() {
		if (this.user.Type === "students") {
			return false;
		}
		else {
			return true;
		}
	}

	//updates the answer with the information from the form
	editAnswerFromForm(submitted: boolean) {
		if (environment.production && false) {
			this.sub.unsubscribe();
		}
		this.questionService.editAnAnswer(this.currentQuestion, this.currentQuestion.answer.text, submitted, this.user.id).subscribe(r => this.activeModal.close()
		);
	}

	//automatically saves the text in teh text editor to the question
	autoSave(submitted: boolean) {
		this.questionService.editAnAnswer(this.currentQuestion, this.currentQuestion.answer.text, submitted, this.user.id).subscribe(r => {
			this.save(); this.time();
		});
	}

	//if in production mode then autoSave is on
	save() {
		if (environment.production && false) {
			this.sub = timer(3000).subscribe(() => this.autoSave(this.currentQuestion.answer.submitted));
		}
	}

	//sets lastSavedTime to the current time
	time() {
		this.lastSavedTime = moment().format('LTS');
	}


	//next three methods are used to format the quill editor
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
