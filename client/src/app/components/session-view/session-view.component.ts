import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LabSessionService } from '../../services/labsession.service';
import { LabSession } from '../../models/lab_session.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent implements OnInit {
  @Input() session: LabSession;
  constructor(private route: ActivatedRoute, private location: Location, private labsessionService: LabSessionService) { }

  ngOnInit() {
    this.getSession();
  }

  getSession(){
    const id = +this.route.snapshot.paramMap.get('id');
    this.labsessionService.getSession().subscribe(session => this.session = session);
  }
}
