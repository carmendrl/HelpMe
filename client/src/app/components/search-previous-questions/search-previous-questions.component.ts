import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LabSessionService } from '../../services/labsession.service';
import { QuestionService } from '../../services/question.service';
import { LabSession } from '../../models/lab_session.model';
import { Observable, forkJoin } from 'rxjs';
import { ApiResponse } from '../../services/api-response';
import { Question } from '../../models/question.model';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CopyQuestionsStatusComponent } from '../copy-questions-status/copy-questions-status.component';

@Component({
	selector: 'app-search-previous-questions',
	templateUrl: './search-previous-questions.component.html',
	styleUrls: ['./search-previous-questions.component.scss']
})
export class SearchPreviousQuestionsComponent implements OnInit {

	private selectedSession: LabSession;//the session selected in the dropdown
	private sessionQuestions: Question[];//the selected session questions
	private state: string;//used in error handling
	private errorQuestions: ApiResponse<Question>[]; //used in error handling
	private confirmedQuestions: Question[];

	@Input() private currentSession: LabSession;

	private notAnsweredSelection: Question[] = new Array<Question>();
	private answeredSelection: Question[] = new Array<Question>();
	private faqSelection: Question[] = new Array<Question>();
	private selectedQuestions: Question[] = new Array<Question>();

	private getQuestions: Question[];
	private questionMessage: string[];
	private getQuestionsError: boolean;
	private errorGetQuestions: ApiResponse<Question[]>;

	//lists of questions
	private FaQs: Question[];
	private answeredQs: Question[];
	private notAnsweredQs: Question[];

	faqHeader: string = "FAQs";
	answeredQuestionsHeader: string = "Answered Questions";
	notAnsweredHeader: string = "Unanswered Questions";

	//  These are needed because an Angular template can only access
	//  instance fields, not static member variables
	private readonly selecting = CopyQuestionsStatusComponent.SELECTING;
	private readonly copying = CopyQuestionsStatusComponent.COPYING;
	private readonly copied = CopyQuestionsStatusComponent.COPIED;
	private readonly error = CopyQuestionsStatusComponent.ERROR;

	constructor(private activeModal: NgbActiveModal,
		private labSessionService: LabSessionService, private questionService: QuestionService, private route: ActivatedRoute, privatelocation: Location) {
		this.FaQs = new Array<Question>();
		this.answeredQs = new Array<Question>();
		this.notAnsweredQs = new Array<Question>();
		this.state = CopyQuestionsStatusComponent.SELECTING;
	}

	onSessionSelected(session) {
		this.selectedSession = session;
		this.loadSessionQuestions();
	}

	answeredSelectionChanged(selected) {
		this.answeredSelection = selected;
		this.mergeSelections();
	}

	faqSelectionChanged(selected) {
		this.faqSelection = selected;
		this.mergeSelections();
	}

	notAnsweredSelectionChanged(selected) {
		this.notAnsweredSelection = selected;
		this.mergeSelections();
	}

	mergeSelections() {
		this.selectedQuestions = this.answeredSelection.concat(this.notAnsweredSelection).concat(this.faqSelection);
	}

	cancel() {
		this.activeModal.dismiss();
	}

	ngOnInit() {
	}

	//loads a list of question for a specific session
	private loadSessionQuestions() {
		this.questionService.getSessionQuestions(this.selectedSession.id).subscribe(questions => {
			this.sessionQuestions = questions.Data;
			this.sortQuestions(this.sessionQuestions);
			this.handleGetQuestionsError(questions)
		});
	}


	copyAllQuestions() {
		this.state = CopyQuestionsStatusComponent.COPYING;

		let sessionSelected = this.selectedSession;

		let copyRequests: Observable<ApiResponse<Question>>[] = this.selectedQuestions.map(question => this.questionService.copyQuestion(question, this.currentSession));

		//  forkJoin will subscribe to all the questions, and emit a single array value
		//  containing all of the questions
		forkJoin(copyRequests).subscribe(
			qArray => this.handleCopyQuestionResponse(qArray)
		);
	}

	submitShouldBeDisabled(): boolean {
		return this.selectedSession === undefined;
	}

	//sort the questions into their respective lists
	sortQuestions(questions: Question[]) {
		//clears the array
		this.FaQs.length = 0;
		this.answeredQs.length = 0;
		this.notAnsweredQs.length = 0;
		for (let question of questions) {
			if (question.isAnswered) {
				if (question.faq) {
					this.FaQs.push(question);
				}
				else {
					this.answeredQs.push(question);
				}
			}
			else {
				this.notAnsweredQs.push(question);
			}
		}
	}

	//error handlers
	private handleGetQuestionsError(questions: ApiResponse<Question[]>) {
		if (!questions.Successful) {
			this.state = CopyQuestionsStatusComponent.ERROR;
			this.errorGetQuestions = questions;
			this.getQuestions = <Question[]>questions.Data;
			this.questionMessage = questions.ErrorMessages;
			this.getQuestionsError = true;
		}
		else {
			this.state = "loaded";
			this.getQuestions = <Question[]>questions.Data;
		}
	}

	private handleCopyQuestionResponse(qArray: ApiResponse<Question>[]) {
		if (qArray.some(r => !r.Successful)) {
			this.state = CopyQuestionsStatusComponent.ERROR;
			this.errorQuestions = qArray.filter(r => !r.Successful);
			this.confirmedQuestions = qArray.filter(r => r.Successful).map(r => <Question>r.Data);
		}
		else {
			this.state = CopyQuestionsStatusComponent.COPIED;
			this.confirmedQuestions = qArray.map(r => <Question>r.Data);
		}
	}

}
