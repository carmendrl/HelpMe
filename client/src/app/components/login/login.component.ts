import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

import { User } from '../../models/user.model';

//import { timer } from 'rxjs
//import { Observable} from 'rxjs/Rx';
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

  private currentUser : User;

  private time: number = 0;
  private interval;
  private play;



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
    //stimer();
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

stopTimer(){
    this.subscription.unsubscribe();
}
