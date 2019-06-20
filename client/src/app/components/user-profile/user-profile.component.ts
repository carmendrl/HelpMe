import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private currentUser: User;

  constructor(private userService : UserService, private router : Router) {

  }

  ngOnInit() { }

  logout () : void {
    this.userService.logout().subscribe (
      success => this.handleLogoutResponse(success)
    );
  }

  switchTypes(user: User){
    if(user.ActingAsStudent === true){
      user.ActingAsStudent = false;
    }
    else if(user.ActingAsStudent === false || user.ActingAsStudent === undefined){
      user.ActingAsStudent = true;
    }
  }
	gravatarImageUrl (user: User) : string {
			let email : string = user.EmailAddress;
			//debugger
			let matches = email.match(/(.*)\+.*@hope\.edu$/i);
			if (matches && matches.length > 1) {
				email = `${matches[1]}@hope.edu`;
			}
			let hashedEmail : string = <string> Md5.hashStr(email);
			hashedEmail = hashedEmail.toLowerCase();

			return `https://www.gravatar.com/avatar/${hashedEmail}?s=40`;
	}

  viewProfile(){
    this.router.navigateByUrl(`user/profile`);
  }

  private handleLogoutResponse(wasLoggedOut : boolean) {
    if (wasLoggedOut) {
      this.router.navigateByUrl("/");
    }
  }
}
