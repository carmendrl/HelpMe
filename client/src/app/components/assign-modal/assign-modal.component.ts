import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { LabSessionService } from '../../services/labsession.service';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { LabSession } from '../../models/lab_session.model';
import { Title } from '@angular/platform-browser';
import { ApiResponse } from '../../services/api-response';

@Component({
	selector: 'app-assign-modal',
	templateUrl: './assign-modal.component.html',
	styleUrls: ['./assign-modal.component.scss']
})
export class AssignModalComponent implements OnInit, OnDestroy {
	@Input() private currentQuestion: Question;
	private sessionTAs: User[]; //list of the session TAs
	private selectedUser: User = new User(); //the user that is selected to assign to
	private sessionReloaded: boolean = false; //has the session reloaded?
	private currentUser: User; //the user who is logged in

	//used in error handling
	private state: string;
	private errorUsers: ApiResponse<LabSession>; //the labsession with the error
	private loadUsers: LabSession;
	private userMessage: string[]; //the error message
	private loadUserError: boolean; //was there an error?

	constructor(private activeModal: NgbActiveModal, private modalService: NgbModal,
		private labSessionService: LabSessionService, private questionService:
			QuestionService, private userService: UserService, private titleService: Title) {
		this.sessionTAs = new Array<User>();
	}

	ngOnInit() {
		//finds the current user and loads the list of session users
		this.userService.CurrentUser$.subscribe(
			u => {
				this.currentUser = u;
				this.loadSessionUsers();
			})

		this.titleService.setTitle('Assign a Question - Help Me');
	}

	ngOnDestroy() {
		this.titleService.setTitle('Session View - Help Me');
	}

	//loads the list of session users who are TAs or professors
	private loadSessionUsers(): void {
		let labSessionId: string = this.currentQuestion.session.id;
		this.sessionReloaded = false;

		this.labSessionService.getSession(labSessionId).subscribe(
			s => {
				this.sessionTAs = s.Data.members.filter(
					//finds users that are professors or TAs and are not the current user
					u => (u.Type == 'professors' || u.Role == 'ta') && u.id != this.currentUser.id
				);
				if (this.sessionTAs.length > 0) {
					this.selectedUser = this.sessionTAs[0]; //sets selected user to the first TA in the list
				}
				this.handleLoadSessionUsersError(s);
				this.sessionReloaded = true;
			}
		);
	}

	//assigns the selected question to the selected user and closes the modal
	assignSelectedUser() {
		this.questionService.assignQuestion(this.selectedUser, this.currentQuestion).subscribe(r => this.activeModal.close());
	}

	//if there is no selected usesr then the form can not be submitted
	submitShouldBeDisabled(): boolean {
		return this.selectedUser === undefined;
		//.id == undefined || this.selectedUser.EmailAddress === ""
	}

	//handles errors in loading session users
	private handleLoadSessionUsersError(users: ApiResponse<LabSession>) {
		if (!users.Successful) {
			this.state = "errorLoadingUser";
			this.errorUsers = users;
			this.loadUsers = <LabSession>users.Data;
			this.userMessage = users.ErrorMessages;
			this.loadUserError = true;
		}
		else {
			this.state = "loaded";
			this.loadUsers = <LabSession>users.Data;
		}
	}

}
