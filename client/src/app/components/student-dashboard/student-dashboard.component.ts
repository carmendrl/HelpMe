import { Component, OnInit, Input } from '@angular/core';
import { LabSessionService } from '../../services/labsession.service';
import { QuestionService } from '../../services/question.service';
import { AudioService } from '../../services/audio.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { LabSession } from '../../models/lab_session.model';
import { Question } from '../../models/question.model';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from '../../services/api-response';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  private sessions : ApiResponse<LabSession[]>;
  private myQuestions : Question[];
  private invalidId: boolean;
  private token: string;
  private currentDate: Date;
  private started: boolean;
  private state: string;
  private errorSessions: ApiResponse<LabSession[]>;
  private loadedSessions: LabSession[];
  private joinSessionError: boolean;
  private stateLabSession: string;
  private errorSession: ApiResponse<string>;
  private joinSession: string;
  private sessionMessage: string[];
  closeResult: string;

  constructor(private labSessionService : LabSessionService, private userService: UserService, private questionService: QuestionService,private modalService: NgbModal,
    private router : Router) {
    this.sessions = new ApiResponse<LabSession[]>(false);
    this.sessions.Data = new Array<LabSession>();
  }

  ngOnInit() {
    this.labSessionService.labSessions().subscribe (
      sessions => this.sessions = sessions
    );

    this.questionService.questionList().subscribe (
      questions => this.myQuestions = questions
    );
    this.invalidId= false;

  }

  joinSess(content){
    this.labSessionService.joinASession(this.token).subscribe(
      sessionId => {
        if(sessionId != undefined){
          this.invalidId = false;
      }
      else{
        this.invalidId = true;
      }
      this.checkIfStarted(sessionId.Data, content);
  })
}
private handleJoinSession(sessionId: ApiResponse<string>){
  if(!sessionId.Successful){
    this.stateLabSession = "errorJoiningSession";
    this.errorSession = sessionId;
    this.joinSession = <string>sessionId.Data;
    this.sessionMessage = sessionId.ErrorMessages;
    this.joinSessionError = true;
  }
  else{
    this.stateLabSession = "loaded";
    this.joinSession = <string>sessionId.Data;
  }
}
  checkIfStarted(id: string, content){
    this.currentDate = new Date();
    this.labSessionService.getStartDate(this.token).subscribe(r =>
      {
        let tenBefore = new Date(r.toString());
        tenBefore.setMinutes(r.getMinutes()-10);
        if(this.currentDate < tenBefore){
          this.started = false;
          this.open(content);
        }
        else{
          this.started = true;
          this.router.navigateByUrl(`/lab_sessions/${id}`);
        }
        }
      );
  }

  open(content) {
    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-not-started'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
