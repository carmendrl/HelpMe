import { Component, OnInit } from '@angular/core';
import { LabSessionService } from '../../services/labsession.service';
import { QuestionService } from '../../services/question.service';
import { Router } from '@angular/router';
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
  private sessionId: number;
  private token: string;

  constructor(private labSessionService : LabSessionService, private questionService: QuestionService, private router : Router) { }

  ngOnInit() {
    this.labSessionService.labSessions().subscribe (
      sessions => this.sessions = sessions
    );

    this.questionService.myQuestions.subscribe (
      questions => this.myQuestions = questions
    );
  }

  joinSess(){
    debugger
    this.labSessionService.joinASession(this.token).subscribe(
      sessionId => this.router.navigateByUrl(`/lab_sessions/${sessionId}`)
    );
    debugger


  }

}
