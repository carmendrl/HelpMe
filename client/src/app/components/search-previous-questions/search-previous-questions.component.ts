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
  private sessions : LabSession[] = [];
  private selectedSession : LabSession = new LabSession();
  private sessionReloaded : boolean = false;
  private sessionQuestions : Question[];
  private state : string;
  private sessionId: string;
  private question : Question;
  private errorQuestions: ApiResponse<Question>[];
  private confirmedQuestions: Question[];
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
    }

  ngOnInit() {
    this.loadSessions();
    this.sessionId = this.route.snapshot.paramMap.get('id');
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
        this.loadSessionQuestions();
      }
    );
  }

  private loadSessionQuestions(){
    //debugger
    this.questionService.getSessionQuestions(this.selectedSession.id).subscribe(questions => {this.sessionQuestions = questions; this.sortQuestions(this.sessionQuestions);});
  }

  copyAllQuestions(){
    this.state = "copyingQuestions";
    let sessionSelected = this.selectedSession;

    let copyQuestions = this.labSessionService.copyQuestions;
    let tempQuestion: Question;
    let copiedQuestions : Observable<ApiResponse<Question>>[] = copyQuestions.map(question => this.questionService.askQuestion(question.text, this.sessionId, question.step, question.faq, question.answer));

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
