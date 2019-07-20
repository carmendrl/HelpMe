import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../services/api-response';

@Component({
	selector: 'app-create-ta',
	templateUrl: './create-ta.component.html',
	styleUrls: ['./create-ta.component.scss']
})
export class CreateTAComponent implements OnInit {

	firstName: string;
	lastName: string;
	email: string;
	pending: boolean; //is the account being created

	//used in error handling
	private state: string;
	private errorUser: ApiResponse<User>;
	private createdUser: User;
	private createTAmessageSuccess: string;
	private createTAmessageError: string[]; //error messages
	private createTAError: boolean; //was there an error creating the TA?
	private taCreated: boolean; //was the TA created?


	constructor(private userService: UserService, private modalService: NgbModal) { }

	ngOnInit() {
	}

	//creates a new TA account using the information provided in the form
	createTA() {
		let newLastName = this.lastName + "(TA)"; //adds "(TA)" to the lastName to indicate their status
		//creates a new email by adding +ta to the end of the student's email
		let email = this.email.substring(0, this.email.indexOf('@')) + "+ta" + this.email.substring(this.email.indexOf('@'));
		let password = this.generatePassword(email); //generates a password based on their email
		let user = new User(); //creates a new user that will be the TA
		//sets adds the information from the form to the new user
		user.FirstName = this.firstName;
		user.LastName = this.lastName;
		user.EmailAddress = email;
		user.Password = password;
		user.Username = this.firstName + "_" + this.lastName;
		user.Type = "Student";

		this.pending = true;
		//makes the user a TA
		this.userService.createTA(user).subscribe(user => {
			this.handleCreateTAResponse(user);
			this.pending = false;
			//handles errors
			if (this.state != "errorCreatingTA") {
				this.userService.promoteToTA(user.Data.id).subscribe(user => {
					this.handleCreateTAResponse(user);
					if (this.createTAError === false) {
						this.modalService.dismissAll();
					}
				}
				)
			};
		});

	}

	//generates a password for the TA that is based on their new email
	generatePassword(email: string) {
		//takes all the odd characters
		var newEmail: string = "";
		for (var i = 0; i < email.length; i++) {
			if (i % 2 == 1) {
				newEmail += email.charAt(i);
			}
		}
		//rotates everything to the right once
		var newEmail2: string = "";
		for (var i = 0; i < newEmail.length; i++) {
			newEmail2 += newEmail.charAt(i + 1);
		}
		//adds the first character onto the end
		newEmail2 += newEmail.charAt(0);
		return newEmail2.substring(0, 8);
	}

	//handles an error when creating TA
	private handleCreateTAResponse(ta: ApiResponse<User>) {
		if (!ta.Successful) {
			this.state = "errorCreatingTA";
			this.errorUser = ta;
			this.createdUser = <User>ta.Data;
			this.createTAmessageError = ta.ErrorMessages;
			this.createTAError = true;
		}
		else {
			this.taCreated = true;
			this.state = "created";
			this.createdUser = <User>ta.Data;
			this.createTAmessageSuccess = "successfully created";
		}
	}

}
