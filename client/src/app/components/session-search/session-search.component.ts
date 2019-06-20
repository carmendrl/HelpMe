import { Component, OnInit, Input } from '@angular/core';
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

  closeResult: string;
  private sessions : LabSession[] = [];
  private selectedSession : LabSession = new LabSession();
  private sessionReloaded : boolean = false;
  private state : string;
  private question : Question;
  private errorQuestions: ApiResponse<Question>[];
  private confirmedQuestions: Question[];
  @Input() private currentLabSession : LabSession;

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal,
    private labSessionService : LabSessionService, private questionService: QuestionService) {}

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
    //debugger
    this.state = "copyingQuestions";
    let sessionSelected = this.selectedSession;

    let copyQuestions = this.labSessionService.copyQuestions;
    //debugger
    let copiedQuestions : Observable<ApiResponse<Question>>[] = copyQuestions.map(question => this.questionService.askQuestion(question.text, this.selectedSession.id, question.step, question.plaintext));

		//  forkJoin will subscribe to all the questions, and emit a single array value
		//  containing all of the questions
		forkJoin(copiedQuestions).subscribe (
			qArray => this.handleCopyQuestionResponse(qArray)
		);
    this.modalService.dismissAll();
  }

  private handleCopyQuestionResponse (qArray : ApiResponse<Question>[]) {
		if (qArray.some(r => !r.Successful)) {
			this.state = "errorCopyingQuesstion";
			this.errorQuestions = qArray.filter(r => !r.Successful);
			this.confirmedQuestions = qArray.filter(r => r.Successful).map(r => <Question> r.Data);
		}
		else {
			this.state = "copied";
			this.confirmedQuestions =qArray.map(r => <Question> r.Data);
		}
	}

  submitShouldBeDisabled() : boolean {
    return this.selectedSession === undefined;
    //.id == undefined || this.selectedUser.EmailAddress === ""
  }

}
