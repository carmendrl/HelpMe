import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-me-too-button',
  templateUrl: './me-too-button.component.html',
  styleUrls: ['./me-too-button.component.scss']
})
export class MeTooButtonComponent implements OnInit {
  @Input() private currentQuestion : Question;
  private currentUser : User;

  constructor(private questionService: QuestionService, private userService: UserService) {
    this.currentUser = new User();
  }

  ngOnInit() {
    this.userService.CurrentUser$.subscribe(
      u => this.currentUser = u);
  }

  addMeToo(){
    this.questionService.addMeToo(this.currentQuestion, true, this.currentUser).subscribe();
  }
  //curently unused function (as no button appears for a user to unmetoo a question)
  removeMeToo(){
    this.questionService.addMeToo(this.currentQuestion, false, this.currentUser).subscribe();
  }
}
