import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { LabSessionService } from '../../services/labsession.service';

import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { LabSession } from '../../models/lab_session.model';
import { Title }     from '@angular/platform-browser';



@Component({
  selector: 'app-assign-modal',
  templateUrl: './assign-modal.component.html',
  styleUrls: ['./assign-modal.component.scss']
})
export class AssignModalComponent implements OnInit, OnDestroy {
  @Input() private currentQuestion: Question;
  closeResult: string;
  private sessionTAs : User[] = [];
  private selectedUser : User = new User();
  private sessionReloaded : boolean = false;
  private currentUser : User;

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal,
    private labSessionService : LabSessionService, private questionService:
    QuestionService, private userService : UserService, private titleService: Title) {}

  ngOnInit() {
    this.userService.CurrentUser$.subscribe (
      u => {
        this.currentUser = u;
        this.loadSessionUsers();
      })

      this.titleService.setTitle('Assign a Question - Help Me');
  }

  ngOnDestroy(){
    this.titleService.setTitle('Session View - Help Me');
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

  assignSelectedUser(){
    this.questionService.assignQuestion(this.selectedUser, this.currentQuestion).subscribe(r => this.activeModal.close());
  }

  submitShouldBeDisabled() : boolean {
    return this.selectedUser === undefined;
    //.id == undefined || this.selectedUser.EmailAddress === ""
  }
}
