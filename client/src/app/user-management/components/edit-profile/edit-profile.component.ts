import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from '../../../services/api-response';
import { RoutingHelperService } from '../../../services/routing-helper.service';

import * as HttpStatus from 'http-status-codes';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
	private user: User;
	saved: boolean = false;
	private currentPassword: string;
	private failedEdit: boolean;
	private wantsNotifications: boolean;
	private createAccountErrorMessage: string;
	private firstName: string;
	private lastName: string;
	private username: string;
	private email: string;
	private password: string;
	private confirmPassword: string;

	@ViewChild("success", { static: true })
	private successModalContent: ElementRef;

	constructor(private router: Router, private userService: UserService, private titleService: Title,
		private modalService: NgbModal, private routingHelper: RoutingHelperService) {
		this.userService.CurrentUser$.subscribe(r => {
			this.user = r;
			this.firstName = this.user.FirstName;
			this.lastName = this.user.LastName;
			this.username = this.user.Username;
			this.email = this.user.EmailAddress;
			this.password = this.user.Password;
		}
		);
		this.failedEdit = false;
		this.wantsNotifications = false;
		this.createAccountErrorMessage = "";
		this.confirmPassword = "";
	}

	ngOnInit() {
		this.titleService.setTitle('Edit My Profile - Help me');
	}

	checkIfNotStudent() {
		if (this.user != undefined) {
			if (this.user.Type === "students") {
				return false;
			} else {
				return true;
			}
			return false;
		}
	}

	private showSuccessModal(): void {
		let options: NgbModalOptions = {
			centered: true
		}
		this.modalService.open(this.successModalContent, options).result.then(
			(result) => this.userService.logout().subscribe((result) => this.router.navigateByUrl('/login'))
		);
	}

	editProfileFromForm() {
		this.saved = true;
		this.userService.editUserProfile(this.user, this.email,
			this.username, this.firstName, this.lastName,
			this.password).subscribe
			(r => {
				if (r.Successful) {
					this.showSuccessModal();
				};
			});
	}

	onCancelClicked(): void {
		if (this.routingHelper.PreviousURL) {
			this.router.navigateByUrl(this.routingHelper.PreviousURL);
		}
		else {
			this.router.navigateByUrl('/');
		}
	}
}
