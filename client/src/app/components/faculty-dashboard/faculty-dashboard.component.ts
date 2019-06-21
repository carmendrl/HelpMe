import { Component, OnInit } from '@angular/core';

import { LabSession } from '../../models/lab_session.model';
import { UserService } from '../../services/user.service';

import { LabSessionService } from '../../services/labsession.service';
@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.scss']
})
export class FacultyDashboardComponent implements OnInit {

  private pastSessions : LabSession[];

  constructor(private labSessionService : LabSessionService, private userService: UserService) {
  this.pastSessions = new Array<LabSession>();
}

  ngOnInit() {
    this.labSessionService.labSessions().subscribe(
      sessions =>
        this.pastSessions = this.pastSessions.concat(sessions)) ;

    this.labSessionService.newLabSession$.subscribe(
      session =>
        this.pastSessions.unshift(session)
    );
  }


}
