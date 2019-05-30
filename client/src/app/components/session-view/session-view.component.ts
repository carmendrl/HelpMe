import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LabSessionService } from '../../services/labsession.service';
import { LabSession } from '../../models/lab_session.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent implements OnInit {
  @Input() session: LabSession;
  public questions: Question[];

  constructor(private userService : UserService, private questionService: QuestionService) { }

  ngOnInit() {
    this.getSessionQuestions();
  }

  getSessionQuestions(){
    this.questionService.getSessionQuestions().subscribe(
      questions => this.questions = questions
    );
    debugger
  }

}
