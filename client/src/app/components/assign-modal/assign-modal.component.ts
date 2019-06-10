import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
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

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal, private userService: UserService, private questionService: QuestionService) { }

  ngOnInit() {

  }

  findUsers (value$ : Observable<string>){
  		return value$.pipe(
  			debounceTime(200),
  			distinctUntilChanged(),
  			mergeMap(searchTerm => searchTerm.length < 2 ? of([]) : this.userService.findUserByEmail(searchTerm,this.currentQuestion))
  		);
    }

  formatUserForTypeAhead (user : User) : string {
		if (user.id=== undefined || user.FullName === "") {
			return "";
		}

		return `${user.FullName} (${user.EmailAddress})`;
	}

  submitShouldBeDisabled() : boolean {
  			return this.selectedUser.id == undefined || this.selectedUser.EmailAddress === "";
  	}

  assignSelectedUser(){
    this.questionService.assignQuestion(this.selectedUser, this.currentQuestion).subscribe(r => this.activeModal.close());
  }


}
