import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';
import { LabSessionService } from '../../services/labsession.service';
import { LabSession } from '../../models/lab_session.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { QuestionService } from '../../services/question.service';
import { Router } from '@angular/router';

import { CopyQuestionsDialogComponent } from '../copy-questions-dialog/copy-questions-dialog.component';

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

	public qrCodeCopiedSuccessfully : boolean;

  constructor(
		private userService : UserService, private questionService: QuestionService,
		private route: ActivatedRoute, private labSessionService : LabSessionService,
		public audioService : AudioService, private modalService : NgbModal,
		public routingHelperService : RoutingHelperService,
		@Inject(DOCUMENT) public document: Document
	) {
  }

	get qrCodeDestination() : string {
		return this.routingHelperService.qrCodeDestinationForSession(this.currentSession);
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
		this.qrCodeCopiedSuccessfully = false;
		return this.modalService.open(dialogContent, <NgbModalOptions>{ariaLabelledBy: 'modal-qrcode'}).result;
	}

	copyQRCode(){
		let img = this.document.createElement('img');
		img.src=this.qrCodeDestination;
		this.document.body.appendChild(img);
		var r = this.document.createRange();
		r.setStartBefore(img);
		r.setEndAfter(img);
		r.selectNode(img);
		var sel = window.getSelection();
		sel.addRange(r);
		this.document.execCommand('Copy');
		this.qrCodeCopiedSuccessfully = true;
	}
}
