import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as HttpStatus from 'http-status-codes';
import { UserService } from '../../services/user.service';
import { ApiResponse } from '../../services/api-response';
import { RoutingHelperService } from '../../services/routing-helper.service';
import { LoggedinGuard } from '../../auth/loggedin.guard';
import { Title }     from '@angular/platform-browser';
import { User } from '../../models/user.model';
import { timer } from 'rxjs/observable/timer';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  private emailAddress : string;
  private password : string;

  private failedLogin : boolean; //did the login fail?

  protected currentUser : User;

  private time: number = 0;


  constructor(public titleService: Title, public userService : UserService, public router : Router, private loggedInGuard : LoggedinGuard, private routingHelper: RoutingHelperService) {
    this.failedLogin = false;

    this.currentUser = new User();
    this.currentUser.Username = "";
  }

  ngOnInit() {
    //load the current user into currentUser
    this.userService.CurrentUser$.subscribe(
      u => this.currentUser = u
    );
    this.titleService.setTitle('Log into Help Me');
  }

  //check to make sure that the email is in the correct format
  emailIsValid() : boolean {
    return /^\S+@\S+(\.\S+)+$/.test(this.emailAddress);
  }


  //login the user
  onSubmit() : void {

    this.userService.login(this.emailAddress, this.password).subscribe(
      response => this.handleLoginResponse(response)
    );
  }

  //log the user out
  doLogout() : void {
    this.userService.logout().subscribe(
      response => {
        if (response) {
          this.currentUser.Username = "";
        }
      }
    )
  }

  //keep track of how long it take to log in
  loginTimer(){
    if (environment.production) {
      const source = timer(0,1000);
      const subscribe = source.subscribe(val => this.time = val);
    }
  }

  //handle error when logging in
  handleLoginResponse (response : ApiResponse<User>) {
    if (response.Successful) {
      this.failedLogin = response.HttpStatusCode == HttpStatus.UNAUTHORIZED;
      if (!this.failedLogin) {
        if (this.loggedInGuard.urlAfterLogin != "") {
          this.router.navigateByUrl(this.loggedInGuard.urlAfterLogin);
        }
        else if (response.Data.Type == 'professors') {
          //if there are professor accounts to be confirmed and user is a professor route to the requests.
          this.routingHelper.goToConfirmPromotionRequests();
        }
        else {
          this.routingHelper.goToDashboard();
        }
      }
    }
    else {
      console.log("Unsuccessful call to login API call");
    }
  }

}
