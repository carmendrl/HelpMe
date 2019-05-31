import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { SessionViewComponent } from '../session-view/session-view.component';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-faculty-session-view',
  templateUrl: './faculty-session-view.component.html',
  styleUrls: ['./faculty-session-view.component.scss']
})
export class FacultySessionViewComponent extends SessionViewComponent implements OnInit{
  private unclaimedQs: Question[];
  private myQs: Question[];
  private faQs: Question[];
  private otherAnsweredQs:  Question[];

  constructor(userService: UserService, questionService: QuestionService) { super(userService, questionService); }

  ngOnInit() {
  }

  sortQuestions(questions: Question[], user:User ){ //need to add some sport of user identification
    for (let question of questions){
      if(question.answer){
        //faq of question is assumed to be a boolean
        if (true){//questions.faq){
          this.faQs.push(question);
        }
        else{
          this.otherAnsweredQs.push(question);
        }
      }
      //how this is implemented this depends on how the assinged/claimed/pending variables look
      //as a part of the question model
      //right now assuming that queestions would have the the id of the user that
      //claimed/got assigned the question and would be compared to the current user's id.
      else if(true){//question.assignedId === user.id){ //assinged or claimed by me
        this.myQs.push(question);
      }
      else{
        this.unclaimedQs.push(question);
      }
    }
  }

}
