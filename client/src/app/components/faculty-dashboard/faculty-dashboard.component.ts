import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../../services/api-response';
import { LabSession } from '../../models/lab_session.model';
import { UserService } from '../../services/user.service';

import { LabSessionService } from '../../services/labsession.service';
@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.scss']
})
export class FacultyDashboardComponent implements OnInit {

  private pastSessions : ApiResponse<LabSession[]>;
  private state: string;
  private errorSessions: ApiResponse<LabSession[]>;
  private loadedSessions: LabSession[];
  private sessionMessage: string[];
  private loadSessionError: boolean;

  constructor(private labSessionService : LabSessionService, private userService: UserService) {
  this.pastSessions = new ApiResponse<LabSession[]>(false);
  this.pastSessions.Data = new Array<LabSession>();
}

  ngOnInit() {
    this.labSessionService.labSessions().subscribe(
      sessions =>{;
        this.pastSessions.Data = this.pastSessions.Data.concat(sessions.Data); this.handleLoadSessions(sessions);}) ;

    this.labSessionService.newLabSession$.subscribe(
      session =>
        this.pastSessions.Data.unshift(session)
    );
  }

  private handleLoadSessions(sessions: ApiResponse<LabSession[]>){
    if(!sessions.Successful){
      this.state = "errorLoadingSessions";
      this.errorSessions = sessions;
      this.loadedSessions = <LabSession[]>sessions.Data;
      this.sessionMessage = sessions.ErrorMessages;
      this.loadSessionError = true;
    }
    else{
      this.state = "loaded";
      this.loadedSessions = <LabSession[]>sessions.Data;
    }
  }

}
