import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { LabSessionService } from '../../services/labsession.service';
import { LabSession } from '../../models/lab_session.model';

@Component({
  selector: 'app-session-search',
  templateUrl: './session-search.component.html',
  styleUrls: ['./session-search.component.scss']
})
export class SessionSearchComponent implements OnInit {

  closeResult: string;
  private sessions : LabSession[] = [];
  private selectedSession : LabSession = new LabSession();
  private sessionReloaded : boolean = false;
  @Input() private currentLabSession : LabSession;

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal,
    private labSessionService : LabSessionService) {}

  ngOnInit() {
    this.loadSessions();
  }

  private loadSessions() : void {
    this.sessionReloaded = false;

    this.labSessionService.labSessions().subscribe (
      s => {
        this.sessions = s;
        if (this.sessions.length > 0) {
          this.selectedSession = this.sessions[0];
        }
        this.sessionReloaded = true;
      }
    );
  }

  copyAllQuestions(){
    this.labSessionService.copyQuestionList(this.selectedSession);
    this.modalService.dismissAll();
  }

  submitShouldBeDisabled() : boolean {
    return this.selectedSession === undefined;
    //.id == undefined || this.selectedUser.EmailAddress === ""
  }

}
