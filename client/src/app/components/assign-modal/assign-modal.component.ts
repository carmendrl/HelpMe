import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { LabSessionService } from '../../services/labsession.service';

import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { LabSession } from '../../models/lab_session.model';


@Component({
  selector: 'app-assign-modal',
  templateUrl: './assign-modal.component.html',
  styleUrls: ['./assign-modal.component.scss']
})
export class AssignModalComponent implements OnInit {
  @Input() private currentQuestion: Question;
  closeResult: string;
	private sessionTAs : User[] = [];
  private selectedUser : User = new User();
	private sessionReloaded : boolean = false;
	private currentUser : User;

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal, private labSessionService : LabSessionService, private questionService: QuestionService, private userService : UserService) { }

  ngOnInit() {
		this.userService.CurrentUser$.subscribe (
			u => {
				this.currentUser = u;
				this.loadSessionUsers();
			}
		)
  }

	private loadSessionUsers() : void {
		let labSessionId : string = this.currentQuestion.session.id;
		this.sessionReloaded = false;

		this.labSessionService.getSession(labSessionId).subscribe (
			s => {
				this.sessionTAs = s.members.filter(
					u => (u.Type == 'professors' || u.Role == 'ta') && u.id != this.currentUser.id
				);
				if (this.sessionTAs.length > 0) {
					this.selectedUser = this.sessionTAs[0];
				}
				this.sessionReloaded = true;
			}
		);
	}

  submitShouldBeDisabled() : boolean {
		return this.selectedUser.id == undefined || this.selectedUser.EmailAddress === "";
  }

  assignSelectedUser(){
    this.questionService.assignQuestion(this.selectedUser, this.currentQuestion).subscribe(r => this.activeModal.close());
  }

}
