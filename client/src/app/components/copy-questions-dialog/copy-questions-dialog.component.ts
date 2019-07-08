import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { forkJoin, Observable } from 'rxjs';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { QuestionListComponent } from '../../components/question-list/question-list.component';
import { CopyQuestionsStatusComponent } from '../copy-questions-status/copy-questions-status.component';

import { LabSession } from '../../models/lab_session.model';
import { Question } from '../../models/question.model';

import { ApiResponse } from '../../services/api-response';
import { LabSessionService } from '../../services/labsession.service';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-copy-questions-dialog',
  templateUrl: './copy-questions-dialog.component.html',
  styleUrls: ['./copy-questions-dialog.component.scss']
})
export class CopyQuestionsDialogComponent implements OnInit {

	@Input() private currentSession : LabSession;
	@Input() private questions : Question[];

	@ViewChild(QuestionListComponent, {static:false})
	private questionList : QuestionListComponent;

	private selectedSession : LabSession;
	private selectedQuestions : Question[];

	private state : string;

	private errorQuestions: ApiResponse<Question>[];
	private confirmedQuestions: Question[];

	//  These are needed because an Angular template can only access
	//  instance fields, not static member variables
	private readonly selecting = CopyQuestionsStatusComponent.SELECTING;
	private readonly copying = CopyQuestionsStatusComponent.COPYING;
	private readonly copied = CopyQuestionsStatusComponent.COPIED;
	private readonly error = CopyQuestionsStatusComponent.ERROR;

  constructor(private labSessionService : LabSessionService, private questionService : QuestionService, private activeModal : NgbActiveModal) {
		this.selectedQuestions = new Array<Question> ();
		this.state = 'selecting';
	}

  ngOnInit() {
  }

	onSessionSelected (session) {
		this.selectedSession = session;
	}

	onSelectedQuestionsChanged (questions) {
		this.selectedQuestions = questions;
	}

	copySelectedQuestions () {
		this.state = "copying";
		let copyQuestionRequests : Observable<ApiResponse<Question>>[] = this.selectedQuestions.map(question => this.questionService.copyQuestion(question, this.selectedSession));
		//  forkJoin will subscribe to all the questions, and emit a single array value
		//  containing all of the questions
		forkJoin(copyQuestionRequests).subscribe (
			qArray => {
				this.handleCopyQuestionResponse(qArray);
			}
		);
	}

	cancel () {
		this.activeModal.dismiss('Dismissed by user');
	}

	close () {
		this.activeModal.close('Questions copied');
	}

	private handleCopyQuestionResponse (qArray : ApiResponse<Question>[]) {
		if (qArray.some(r => !r.Successful)) {
			this.state = "errorCopying";
			this.errorQuestions = qArray.filter(r => !r.Successful);
			this.confirmedQuestions = qArray.filter(r => r.Successful).map(r => <Question> r.Data);

			//  Look for questions by text to find the ones that were successfully
			//  copied because ID values in the confirmedQuestions array will be the new ID values
			//  and therefore won't match anything in this.questions
			this.confirmedQuestions.forEach (
				(question, index) => {
					let indexInQuestions = this.questions.findIndex(q => question.plaintext == q.plaintext);
					this.questionList.unselect(indexInQuestions);
				}
			);
		}
		else {
			this.state = "copied";
			this.confirmedQuestions = qArray.map(r => <Question> r.Data);
		}
	}
}
