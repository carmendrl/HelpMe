import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SessionViewComponent } from '../session-view/session-view.component';

@Component({
  selector: 'app-faculty-session-view',
  templateUrl: './faculty-session-view.component.html',
  styleUrls: ['./faculty-session-view.component.scss']
})
export class FacultySessionViewComponent extends SessionViewComponent implements OnInit{

  constructor(userService: UserService) { super(userService); }

  ngOnInit() {
  }

}