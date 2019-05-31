import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { SessionViewComponent } from '../session-view/session-view.component';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-student-session-view',
  templateUrl: './student-session-view.component.html',
  styleUrls: ['./student-session-view.component.scss']
})
export class StudentSessionViewComponent extends SessionViewComponent implements OnInit {
  private faQs: Question[];
  private myQs: Question[];
  private allOtherQs:  Question[];

  constructor(userService: UserService, questionService: QuestionService) { super(userService, questionService); }

  ngOnInit() {
    this.sortQuestions(super.questions);
  }

  sortQuestions(questions: Question[]){ //need to add some sport of user identification
    for (let question of questions){
      //faq of question is assumed to be a boolean
      if (true){//questions.faq){
        this.faQs.push(question);
      }
      //how this is implemented this depends on how the assinged/claimed/pending variables look
      //as a part of the question model
      //right now assuming that queestions would have the the id of the user that
      //asked the question and would be compared to the current user's id.
      else if(true){//question.askedId === user.id){ //assinged or claimed by me
        this.myQs.push(question);
      }
      else{
        this.allOtherQs.push(question);
      }
    }
  }

}
