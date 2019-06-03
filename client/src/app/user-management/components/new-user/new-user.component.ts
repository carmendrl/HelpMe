import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';


import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

	private newUser : User;
  constructor(private router : Router, private userService : UserService) {
		this.newUser = new User();
	}

  ngOnInit() {
  }

	createNewAccount() : void {
    this.userService.createAccount(this.newUser).subscribe(
      r => {
        if (r) {
          this.router.navigateByUrl('/dashboard');
        }
      }
    );
  }
}
