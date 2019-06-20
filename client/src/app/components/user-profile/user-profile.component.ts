import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

import { Md5 } from 'ts-md5/dist/md5';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private currentUser: User;
  closeResult: string;

  constructor(private userService : UserService, private router : Router, private modalService: NgbModal) {

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

  open(content) {
    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-search-sessions'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
