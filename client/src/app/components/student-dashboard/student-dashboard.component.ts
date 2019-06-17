import { Component, OnInit, Input } from '@angular/core';
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
  private invalidId: boolean;
  private token: string;
  @Input() started: boolean = false;

  constructor(private labSessionService : LabSessionService, private questionService: QuestionService,
    private router : Router) { }

  ngOnInit() {
    this.labSessionService.labSessions().subscribe (
      sessions => this.sessions = sessions
    );

    this.questionService.questionList().subscribe (
      questions => this.myQuestions = questions
    );
    this.invalidId= false;

  }

  joinSess(){

    this.labSessionService.joinASession(this.token).subscribe(
      sessionId => {
        if(sessionId != undefined){
          this.invalidId = false;
        if(this.started === true){this.router.navigateByUrl(`/lab_sessions/${sessionId}`)};
      }
      else{
        this.invalidId = true;
      }
    });
  }



}
