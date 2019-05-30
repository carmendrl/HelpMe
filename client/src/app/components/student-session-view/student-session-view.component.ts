import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SessionViewComponent } from '../session-view/session-view.component';

@Component({
  selector: 'app-student-session-view',
  templateUrl: './student-session-view.component.html',
  styleUrls: ['./student-session-view.component.scss']
})
export class StudentSessionViewComponent extends SessionViewComponent implements OnInit {

  constructor(userService: UserService) { super(userService); }

  ngOnInit() {
  }

}