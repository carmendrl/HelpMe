import { Component, OnInit, Input } from '@angular/core';

import { LabSession } from '../../models/lab_session.model';
@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit {

  @Input() private sessions : LabSession[];
  @Input() private label : string = "Matching Sessions";
  constructor() { }

  ngOnInit() {
  }

}
