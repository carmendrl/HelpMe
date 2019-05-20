import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private emailAddress : string;
  private password : string;

  private failedLogin : boolean;

  private currentUser : User;

  constructor(private userService : UserService, private router : Router) {
    this.failedLogin = false;

    this.currentUser = new User();
    this.currentUser.Username = "";
  }

  ngOnInit() {
    this.userService.CurrentUser$.subscribe(
      u => this.currentUser = u
    );
  }

  emailIsValid() : boolean {
    return /^\S+@\S+(\.\S+)+$/.test(this.emailAddress);
  }

  handleLoginResponse (succeeded : boolean) {
    this.failedLogin = !succeeded;
    if (succeeded) {
      this.router.navigateByUrl("/dashboard");
    }
  }

  onSubmit() : void {
    startTimer();
    this.userService.login(this.emailAddress, this.password).subscribe(
      response => this.handleLoginResponse(response)
    );
  }

  doLogout() : void {
    this.userService.logout().subscribe(
      response => {
        if (response) {
          this.currentUser.Username = "";
        }
      }
    )
  }
  time: number = 0;
  interval;

  startTimer() {
    this.play = true;
    this.interval = setInterval(()) => {
      this.time++;
    }, 1000)
  }

  pauseTimer() {
    this.play = false;
    clearInterval(this.interval);
  }
}
