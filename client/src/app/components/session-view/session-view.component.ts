import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LabSessionService } from '../../services/labsession.service';
import { LabSession } from '../../models/lab_session.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
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
  }

//want to make this abstract method but must make this an abstract createNewLabSession
//to make this an abstract class can't have a constructor because can't instantiate
//an abstract class
  sortQuestions(questions: Question[], user:User)
  {}; //may switch to specific user attribute such as type or id

}
