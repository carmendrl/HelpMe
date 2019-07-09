import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { LabSessionService } from '../../services/labsession.service';
import { QuestionService } from '../../services/question.service';
import { LabSession } from '../../models/lab_session.model';
import { Observable, forkJoin } from 'rxjs';
import { ApiResponse } from '../../services/api-response';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-session-search',
  templateUrl: './session-search.component.html',
  styleUrls: ['./session-search.component.scss']
})
export class SessionSearchComponent implements OnInit {

  private sessions : LabSession[]; //list of laabsessions
  private selectedSession : LabSession = new LabSession();
  private sessionReloaded : boolean = false;

  //used in error handling
  private state : string;
  private stateLabSessions: string;
  private sessionMessage: string[];
  private loadSessionError: boolean;

  @Input() private dropdownLabel : string;
  @Input() private currentLabSession : LabSession;

  @Output() private sessionSelected : EventEmitter<LabSession>; //emits the session that is selected

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal,
    private labSessionService : LabSessionService, private questionService: QuestionService) {
      this.sessions = new Array<LabSession>();
      this.sessionSelected = new EventEmitter<LabSession> ();
    }

    ngOnInit() {
      this.loadSessions();
      if (!this.dropdownLabel) { //if no session selected then the header is "select session"
      this.dropdownLabel = "Select session";
    }
  }

  //get the list of labsessions
  private loadSessions() : void {
    this.sessionReloaded = false;

    this.labSessionService.labSessions().subscribe (
      response => {
        if (response.Successful) {
          this.stateLabSessions = "loaded";
          this.sessions = response.Data.filter(ls => ls.id != this.currentLabSession.id);

          if (this.sessions.length > 0) {
            this.selectedSession = this.sessions[0];
            this.onSessionSelected(); //emits the selected session
          }

          this.sessionReloaded = true;
        }
        else {
          this.handleLoadSessionsError (response);
        }
      }
    );
  }

  //emits the selected session
  private onSessionSelected() {
    this.sessionSelected.emit(this.selectedSession);
  }

  //submit is disabled if no session is selected
  submitShouldBeDisabled() : boolean {
    return this.selectedSession === undefined;
  }

  //handles errors
  private handleLoadSessionsError(response: ApiResponse<LabSession[]>){
    this.stateLabSessions = "errorLoadingSessions";
    this.loadSessionError = true;
  }

}
