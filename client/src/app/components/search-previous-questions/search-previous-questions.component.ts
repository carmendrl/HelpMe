import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { LabSessionService } from '../../services/labsession.service';
import { QuestionService } from '../../services/question.service';
import { LabSession } from '../../models/lab_session.model';
import { Observable, forkJoin } from 'rxjs';
import { ApiResponse } from '../../services/api-response';
import { Question } from '../../models/question.model';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search-previous-questions',
  templateUrl: './search-previous-questions.component.html',
  styleUrls: ['./search-previous-questions.component.scss']
})
export class SearchPreviousQuestionsComponent implements OnInit {

  closeResult: string;
  private sessions : ApiResponse<LabSession[]>;
  private selectedSession : LabSession = new LabSession();
  private sessionReloaded : boolean = false;
  private sessionQuestions : Question[];
  private stateQuestions : string;
  private sessionId: string;
  private question : Question;
  private errorQuestions: ApiResponse<Question>[];
  private confirmedQuestions: Question[];
  private stateLabSessions: string;
  private errorSessions: ApiResponse<LabSession[]>;
  private loadedSessions: LabSession[];
  private sessionMessage: string[];
  private loadSessionError: boolean;
  @Input() private currentLabSession : string;

  private FaQs: Question[];
  private answeredQs: Question[];
  private notAnsweredQs: Question[];
  currentDate: Date;
  faqHeader: string = "FAQs";
  answeredQuestionsHeader: string = "Answered Questions";
  notAnsweredHeader: string = "Unanswered Questions";



  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal,
    private labSessionService : LabSessionService, private questionService: QuestionService, private route: ActivatedRoute, privatelocation: Location) {
      this.FaQs = new Array<Question>();
      this.answeredQs= new Array<Question>();
      this.notAnsweredQs = new Array<Question>();
      this.sessions.Data = new Array<LabSession>();
    }

  ngOnInit() {
    this.loadSessions();
    this.sessionId = this.route.snapshot.paramMap.get('id');
  }

  private loadSessions() : void {
    this.sessionReloaded = false;

    this.labSessionService.labSessions().subscribe (
      s => {
        this.sessions.Data = s.Data;
        if (this.sessions.Data.length > 0) {
          this.selectedSession = this.sessions.Data[0];
          this.handleLoadSessions(s);
        }
        this.sessionReloaded = true;
        this.loadSessionQuestions();
      }
    );
  }
  private handleLoadSessions(sessions: ApiResponse<LabSession[]>){
    if(!sessions.Successful){
      this.stateLabSessions = "errorLoadingSessions";
      this.errorSessions = sessions;
      this.loadedSessions = <LabSession[]>sessions.Data;
      this.sessionMessage = sessions.ErrorMessages;
      this.loadSessionError = true;
    }
    else{
      this.stateLabSessions = "loaded";
      this.loadedSessions = <LabSession[]>sessions.Data;
    }
  }

  private loadSessionQuestions(){
    //debugger
    this.questionService.getSessionQuestions(this.selectedSession.id).subscribe(questions => {this.sessionQuestions = questions; this.sortQuestions(this.sessionQuestions);});
  }


  copyAllQuestions(){
    this.stateQuestions = "copyingQuestions";
    let sessionSelected = this.selectedSession;

    let copyQuestions = this.labSessionService.copyQuestions;
    let tempQuestion: Question;
    let copiedQuestions : Observable<ApiResponse<Question>>[] = copyQuestions.map(question => this.questionService.askQuestion(question.text, this.sessionId, question.step, question.plaintext, question.faq, question.answer));

		//  forkJoin will subscribe to all the questions, and emit a single array value
		//  containing all of the questions
		forkJoin(copiedQuestions).subscribe (
			qArray => this.handleCopyQuestionResponse(qArray)
		);
    this.modalService.dismissAll();
  }

  private handleCopyQuestionResponse (qArray : ApiResponse<Question>[]) {
		if (qArray.some(r => !r.Successful)) {
			this.stateQuestions = "errorCopyingQuesstion";
			this.errorQuestions = qArray.filter(r => !r.Successful);
			this.confirmedQuestions = qArray.filter(r => r.Successful).map(r => <Question> r.Data);
		}
		else {
			this.stateQuestions = "copied";
			this.confirmedQuestions =qArray.map(r => <Question> r.Data);
		}
	}

  submitShouldBeDisabled() : boolean {
    return this.selectedSession === undefined;
    //.id == undefined || this.selectedUser.EmailAddress === ""
  }

  sortQuestions(questions: Question[]){
    this.currentDate=new Date();
    //clears the array
    this.FaQs.length = 0;
    this.answeredQs.length = 0;
    this.notAnsweredQs.length = 0;
    for (let question of questions){
        if(question.isAnswered){
          if (question.faq){
            this.FaQs.push(question);
          }
          else{
            this.answeredQs.push(question);
          }
        }
        else{
          this.notAnsweredQs.push(question);
        }
    }
  }



}
