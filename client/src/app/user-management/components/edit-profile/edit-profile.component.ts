import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { User } from'../../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  private user: User;
  saved : boolean = false;
  private currentPassword: string;
  //private updatedUser: User;

  // @ViewChild("createprofessor", { static : true})
  // private newProfessorModalContent : ElementRef;

  constructor(private router : Router, private userService: UserService, private titleService:Title, private modalService : NgbModal) {
    this.userService.CurrentUser$.subscribe(r => this.user = r);
    this.userService.CurrrentPassword$.subscribe(p => this.user.Password = p);
  }

  ngOnInit() {
    this.titleService.setTitle('Edit My Profile - Help me');
  }

  checkIfNotStudent(){
    if( this.user != undefined){
      if(this.user.Type === "students"){
        return false;
      }else{
        return true;
      }
      return false;
    }
  }

  editProfileFromForm(){
    this.saved = true;
    this.userService.editUserProfile(this.user, this.user.EmailAddress,
    this.user.Username, this.user.FirstName, this.user.LastName, this.user.Password).subscribe();

  }

  // private showSubmittedModal(){
  //   let options : NgbModalOptions = {
  //     centered:true
  //   }
  //
  //   this.modalService.open(this.newProfessorModalContent, options).result.then(
	// 		(result) => this.router.navigateByUrl('/dashboard'),
	// 		(result) => this.router.navigateByUrl('/')
	// 	);
  //
  // }

  // cancelEdit(){
  //   this.saved=false;
  // }

  gravatarImageUrl (user: User) : string {
      let email : string = user.EmailAddress;
      let matches = email.match(/(.*)\+.*@hope\.edu$/i);
      if (matches && matches.length > 1) {
        email = `${matches[1]}@hope.edu`;
      }
      let hashedEmail : string = <string> Md5.hashStr(email);
      hashedEmail = hashedEmail.toLowerCase();

      return `https://www.gravatar.com/avatar/${hashedEmail}?s=40`;
  }

}
