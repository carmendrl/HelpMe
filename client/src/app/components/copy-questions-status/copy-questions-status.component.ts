import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../../models/question.model';
import { LabSession } from '../../models/lab_session.model';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-copy-questions-status',
	templateUrl: './copy-questions-status.component.html',
	styleUrls: ['./copy-questions-status.component.scss']
})
export class CopyQuestionsStatusComponent implements OnInit {

	@Input() private state: string;
	@Input() private selectedQuestions: Question[];
	@Input() private confirmedQuestions: Question[];
	@Input() private errorQuestions: Question[];
	@Input() private destinationSession: LabSession;

	public static get SELECTING(): string { return "selecting"; }
	public static get COPYING(): string { return "copying"; }
	public static get COPIED(): string { return "copied"; }
	public static get ERROR(): string { return "error"; }

	//  These are needed because an Angular template can only access
	//  instance fields, not static member variables
	private readonly selecting = CopyQuestionsStatusComponent.SELECTING;
	private readonly copying = CopyQuestionsStatusComponent.COPYING;
	private readonly copied = CopyQuestionsStatusComponent.COPIED;
	private readonly error = CopyQuestionsStatusComponent.ERROR;

	constructor(private activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	close(): void {
		this.activeModal.close();
	}
}
