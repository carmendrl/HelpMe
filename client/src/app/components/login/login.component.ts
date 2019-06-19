import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as HttpStatus from 'http-status-codes';

import { UserService } from '../../services/user.service';
import { ApiResponse } from '../../services/api-response';
import { LoggedinGuard } from '../../auth/loggedin.guard';
import { Title }     from '@angular/platform-browser';

import { User } from '../../models/user.model';

import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  private emailAddress : string;
  private password : string;

  private failedLogin : boolean;

  protected currentUser : User;

  private time: number = 0;


  constructor(public titleService: Title, public userService : UserService, public router : Router, private loggedInGuard : LoggedinGuard) {
    this.failedLogin = false;

    this.currentUser = new User();
    this.currentUser.Username = "";
  }

  ngOnInit() {
    this.userService.CurrentUser$.subscribe(
      u => this.currentUser = u
    );
    this.titleService.setTitle('Log into Help Me');
  }

  emailIsValid() : boolean {
    return /^\S+@\S+(\.\S+)+$/.test(this.emailAddress);
  }

  handleLoginResponse (response : ApiResponse<User>) {
		if (response.Successful) {
			this.failedLogin = response.HttpStatusCode == HttpStatus.UNAUTHORIZED;
	    if (!this.failedLogin) {
				if (this.loggedInGuard.urlAfterLogin != "") {
					this.router.navigateByUrl(this.loggedInGuard.urlAfterLogin);
				}
				else if (response.Data.Type == 'professors') {
					this.router.navigateByUrl("/confirm-promotions");
				}
				else {
					this.router.navigateByUrl("/dashboard");
				}
	    }
		}
		else {
			console.log("Unsuccessful call to login API call");
		}
  }

  onSubmit() : void {

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

loginTimer(){
  const source = timer(0,1000);
  const subscribe = source.subscribe(val => this.time=val);
}

}
