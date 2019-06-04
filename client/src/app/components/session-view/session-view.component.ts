import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LabSessionService } from '../../services/labsession.service';
import { LabSession } from '../../models/lab_session.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { QuestionService } from '../../services/question.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent implements OnInit {


  constructor(private userService : UserService, private questionService: QuestionService, private route: ActivatedRoute) {
  }

  ngOnInit() {


  }

}
