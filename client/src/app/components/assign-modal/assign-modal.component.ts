import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';


@Component({
  selector: 'app-assign-modal',
  templateUrl: './assign-modal.component.html',
  styleUrls: ['./assign-modal.component.scss']
})
export class AssignModalComponent implements OnInit {
  @Input() private currentQuestion: Question;
  closeResult: string;
  private selectedUser : User = new User();

  constructor(private modalService: NgbModal, private userService: UserService, private questionService: QuestionService) { }

  ngOnInit() {

  }

  findUsers (value$ : Observable<string>) {
      return value$.pipe(
           debounceTime(200),
           distinctUntilChanged(),
           mergeMap(searchTerm => this.userService.findUserByEmail(searchTerm, this.currentQuestion))
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

  openAssign(content) {
    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-course'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log("Testing Modal");

  }

  assignSelectedUser(user: User){
    this.questionService.assignQuestion(this.selectedUser, this.currentQuestion).subscribe();
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
