import { Component, OnInit } from '@angular/core';
import { LabSessionService } from '../../services/labsession.service';
import { QuestionService } from '../../services/question.service';

import { LabSession } from '../../models/lab_session.model';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  private sessions : LabSession[];
  private myQuestions : Question[];

  constructor(private labSessionService : LabSessionService, private questionService: QuestionService) { }

  ngOnInit() {
    this.labSessionService.labSessions.subscribe (
      sessions => this.sessions = sessions
    );

    this.questionService.myQuestions.subscribe (
      questions => this.myQuestions = questions
    );
  }

}
