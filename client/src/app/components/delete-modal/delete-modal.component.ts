import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/question.model';
import { Answer } from '../../models/answer.model';

@Component({
	selector: 'app-delete-modal',
	templateUrl: './delete-modal.component.html',
	styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
	@Input() private currentQuestion: Question;

	constructor(private activeModal: NgbActiveModal, private userService: UserService,
		private questionService: QuestionService, private modalService: NgbModal,
		private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle('Delete Question - HelpMe');
	}

	ngOnDestroy() {
		this.titleService.setTitle('Session View - HelpMe');
	}

	//delete the currentQuestion from the database and close the modal
	deleteQuestion() {
		this.questionService.deleteAQuestion(this.currentQuestion).subscribe(r => this.activeModal.close());
	}

}
