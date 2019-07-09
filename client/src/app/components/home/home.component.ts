import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private newUser : User;
  private confirmPassword : string;

  constructor(private router : Router, private userService : UserService) {
    this.newUser = new User();
 }

  ngOnInit() {

  }

  gotoLogin() : void {
    this.router.navigateByUrl('/login');
  }

}
