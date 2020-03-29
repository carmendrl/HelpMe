import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-new-user',
	templateUrl: './new-user.component.html',
	styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

	private newUser: User;
	private isProfessor: boolean;

	private createAccountErrorMessage: string;
	private confirmPassword: string;

	@ViewChild("createprofessor", { static: true })
	private newProfessorModalContent: ElementRef;

	constructor(private router: Router, private userService: UserService, private titleService: Title, private modalService: NgbModal) {
		this.newUser = new User();
		this.newUser.Type = 'Student';
		this.isProfessor = false;
		this.createAccountErrorMessage = "";
		this.confirmPassword = "";
	}

	ngOnInit() {
		this.titleService.setTitle('Create an Account - HelpMe');
	}

	createNewAccount(): void {
		this.userService.createAccount(this.newUser, this.isProfessor).subscribe(
			r => {
				if (r.Successful) {
					if (this.isProfessor) {
						this.showNewProfessorModal();
					}
					else {
						this.router.navigateByUrl('/dashboard');
					}
				}
				else {
					this.createAccountErrorMessage = r.ErrorsAsString;
				}
			}
		);
	}

	private showNewProfessorModal(): void {
		let options: NgbModalOptions = {
			centered: true
		}

		this.modalService.open(this.newProfessorModalContent, options).result.then(
			(result) => this.router.navigateByUrl('/dashboard'),
			(result) => this.router.navigateByUrl('/')
		);
	}
}
