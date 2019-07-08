import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LabSessionService } from '../../services/labsession.service';
import { LabSession } from '../../models/lab_session.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { QuestionService } from '../../services/question.service';
import { Router } from '@angular/router';

import { CopyQuestionsDialogComponent } from '../copy-questions-dialog/copy-questions-dialog.component';
import { FacultySessionViewComponent } from '../faculty-session-view/faculty-session-view.component';
import { SearchPreviousQuestionsComponent } from '../search-previous-questions/search-previous-questions.component';
import { QRCodeDialogComponent } from '../qrcode-dialog-component/qrcode-dialog.component';

import { AudioService } from '../../services/audio.service';
import { RoutingHelperService } from '../../services/routing-helper.service';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent implements OnInit {

	private token : string;
  private description:string;
  private subjectAndNumber:string;

	private sessionId : string;
  private currentSession : LabSession;

	@ViewChild (FacultySessionViewComponent, {static: false})
	private facultySessionView : FacultySessionViewComponent;

  constructor(
		private userService : UserService, private questionService: QuestionService,
		private route: ActivatedRoute, private labSessionService : LabSessionService,
		public audioService : AudioService, private modalService : NgbModal,
		public routingHelperService : RoutingHelperService
	) {
  }

  ngOnInit() {
		this.sessionId = this.route.snapshot.paramMap.get('id');
		this.labSessionService.getSession(this.sessionId).subscribe(r =>
			{
				if (r.Successful) {
					this.currentSession = r.Data;
					this.token = this.currentSession.token;
					this.subjectAndNumber = this.currentSession.course.subjectAndNumber;
					this.description = this.currentSession.description;
				}
				else {
					//  TODO  Add error handling here
					console.log('Error loading the lab session');
				}
				//this.getSessionError(session)
			}
		);
  }

	toggleAudio(): void {
		this.audioService.toggleAudio();
		this.audioService.playSilentAudio();
	}

  openCopyQuestionsModal() {
    this.questionService.getSessionQuestions(this.sessionId).subscribe (
			response => {
				if (response.Successful) {
					let questions : Question[] = response.Data;
					let modalRef = this.modalService.open(CopyQuestionsDialogComponent, {size: 'lg'});
					modalRef.componentInstance.questions = questions;
					modalRef.componentInstance.currentSession = this.currentSession;
				}
				else {
					//  TODO  Add error handling here
					console.log("Error occurred trying to retrieve questions for the session");
				}
			}

		)
	}

	openQRCodeModal(dialogContent) : any {
		let modalRef = this.modalService.open(QRCodeDialogComponent);
		modalRef.componentInstance.session = this.currentSession;
	}

	openAddQuestionsFromAnotherSessionModal(dialogContent) {
		let facultySessionView : FacultySessionViewComponent = this.facultySessionView;

		let modalRef = this.modalService.open(SearchPreviousQuestionsComponent, {size: 'lg'});
		modalRef.componentInstance.currentSession = this.currentSession;
		modalRef.result.then (
			function (result) { if (facultySessionView) facultySessionView.refreshData();}
		)
	}
}
