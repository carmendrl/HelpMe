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

  private pastSessions : ApiResponse<LabSession[]>; //a list of past sessions

  //used in error handling
  private state: string;
  private errorSessions: ApiResponse<LabSession[]>;
  private loadedSessions: LabSession[];
  private sessionMessage: string[]; //error messages
  private loadSessionError: boolean;

  constructor(private labSessionService : LabSessionService, private userService: UserService) {
    this.pastSessions = new ApiResponse<LabSession[]>(false);
    this.pastSessions.Data = new Array<LabSession>();
  }

  ngOnInit() {
    //load the list of labsessions and put it in pastSessions
    this.labSessionService.labSessions().subscribe(
      sessions =>{
        this.pastSessions.Data = this.pastSessions.Data.concat(sessions.Data); this.handleLoadSessions(sessions);}) ;
        
        //listen for new labSessions and put then onto the pastSessions list
        this.labSessionService.newLabSession$.subscribe(
          session =>
          this.pastSessions.Data.unshift(session)
        );
      }

      //handle errors
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
