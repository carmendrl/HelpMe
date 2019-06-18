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
  private currentDate: Date;
  private started: boolean;

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
    debugger
    if(this.started === true){
    this.labSessionService.joinASession(this.token).subscribe(
      sessionId => {//debugger
        if(sessionId != undefined){
          this.invalidId = false;
         this.router.navigateByUrl(`/lab_sessions/${sessionId}`);
      }
      else{
        this.invalidId = true;
      }
    });
  };
  }

  checkIfStarted(){
    debugger
    this.currentDate = new Date();
    //this.currentDate.setDay(undefined);
    this.labSessionService.getStartDate(this.token).subscribe(r =>{if(this.currentDate < r){debugger;this.started = false}else{debugger;this.started = true;} this.joinSess();});
  }



}
