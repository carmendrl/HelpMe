import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	private currentUser: User;
	closeResult: string; //why the modal closed
	private mobile: boolean = false; //is the user in mobile view?

	constructor(private userService: UserService, private router: Router, private modalService: NgbModal) {
	}

	ngOnInit() {
		if (window.screen.width <= 500) { //is mobile view if screen size is less than 500
			this.mobile = true;
		};
}

	//log the user out
	logout(): void {
		this.userService.logout().subscribe(
			success => this.handleLogoutResponse(success.Data)
		);
	}

	//switch a professor student view or back
	switchTypes(user: User) {
		if (user.ActingAsStudent === true) {
			user.ActingAsStudent = false;
		}
		else if (user.ActingAsStudent === false || user.ActingAsStudent === undefined) {
			user.ActingAsStudent = true;
		}
	}

	//switch a TA to a student or back
	switchRoles(user: User) {
		user.ActingAsStudent = true;
		if (user.Role === "ta") {
			user.Role = "none"
		}
		else {
			user.Role = "ta"
		}
	}

	//display a users profile image
	gravatarImageUrl(user: User): string {
		let email: string = user.EmailAddress;
		//debugger
		let matches = email.match(/(.*)\+.*@hope\.edu$/i);
		if (matches && matches.length > 1) {
			email = `${matches[1]}@hope.edu`;
		}
		let hashedEmail: string = <string>Md5.hashStr(email);
		hashedEmail = hashedEmail.toLowerCase();

		//  This doesn't work because the image is just barely not square.  For now
		//  we will use the 'mystery person'
		//let defaultImage : string = encodeURI(`http://helpme.hope.edu/logo_main.png`);
		let defaultImage: string = 'mp';
		return `https://www.gravatar.com/avatar/${hashedEmail}?s=40&d=${defaultImage}`;
	}

	//go to the profile page
	viewProfile() {
		this.router.navigateByUrl('/users/profile');
	}

	//open the search questions modal
	open(content) {
		let modal = this.modalService.open(content, <NgbModalOptions>{ ariaLabelledBy: 'modal-search-sessions' }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});

	}

	//set the closedResult reason
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

	//handle errors
	private handleLogoutResponse(wasLoggedOut: boolean) {
		if (wasLoggedOut) {
			this.router.navigateByUrl("/");
		}
	}
}
