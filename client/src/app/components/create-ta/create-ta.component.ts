import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-create-ta',
  templateUrl: './create-ta.component.html',
  styleUrls: ['./create-ta.component.scss']
})
export class CreateTAComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;


  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  createTA(){
    let newLastName = this.lastName + "(TA)";
    let email = this.email.substring(0,this.email.indexOf('@')) + "+ta" + this.email.substring(this.email.indexOf('@'));
    debugger
    let password = Math.random().toString(32).slice(2);
    password = password.substring(0,8);
    let user = new User();
    user.FirstName = this.firstName;
    user.LastName = this.lastName;
    this.userService.createAccount(user, false).subscribe();
    this.userService.promoteToTA(user).subscribe();
}

  //generateRandom()
}
