import { Component, OnInit, Input } from '@angular/core';
import { LabSessionService } from '../../services/labsession.service';

import { LabSession } from '../../models/lab_session.model';
@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit {

  @Input() private sessions : LabSession[];
  @Input() private label : string = "Matching Sessions";
  constructor(private labsessionService: LabSessionService) { }

  ngOnInit() {
    this.getSessions();
  }

  getSessions():void {
    this.labsessionService.labSessions().subscribe(sessions => this.sessions = sessions);

  }

}
