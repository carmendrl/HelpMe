import { Component, OnInit } from '@angular/core';

import { User } from '../../../models/user.model';
import { UserService, PromoteUserResponse } from '../../../services/user.service';

import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-promote-user',
  templateUrl: './promote-user.component.html',
  styleUrls: ['./promote-user.component.scss']
})
export class PromoteUserComponent implements OnInit {

	private selectedUser : User = new User();
	private status : string = "";
  private errorMessages : string[] = [];

  constructor(private userService : UserService) { }

  ngOnInit() {
  }

	findUsers (value$ : Observable<string>) {
		return value$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			mergeMap(searchTerm => searchTerm.length < 2 ? of([]) : this.userService.findUserByEmail(searchTerm, 'student'))
		);
	}

	formatUserForTypeAhead (user : User) : string {
		if (user.FullName === "") {
			return "";
		}

		return `${user.FullName} (${user.EmailAddress})`;
	}

	submitShouldBeDisabled() : boolean {
			return this.selectedUser.id == undefined || this.selectedUser.EmailAddress === "";
	}

	promoteSelectedUser () {
		this.status = "promoting";
		this.userService.requestPromotion(this.selectedUser).subscribe (
			response => {
				if (response.Successful) {
					this.status = "successful";
				}
				else {
					this.status = "error";
					response.ErrorMessages.forEach (e => this.errorMessages.push(e));
				}
			}
		);
	}
}
