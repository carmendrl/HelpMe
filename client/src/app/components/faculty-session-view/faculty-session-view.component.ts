import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { SessionView } from '../../session-view';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-faculty-session-view',
  templateUrl: './faculty-session-view.component.html',
  styleUrls: ['./faculty-session-view.component.scss']
})
export class FacultySessionViewComponent extends SessionView implements OnInit{
  private unclaimedQs: Question[];
  private myQs: Question[];
  private faQs: Question[];
  private otherAnsweredQs:  Question[];

  constructor(userService: UserService, questionService: QuestionService, route: ActivatedRoute, location: Location) { super(userService, questionService, route, location); this.unclaimedQs = new Array<Question>(); this.myQs = new Array<Question>(); this.faQs = new Array<Question>(); this.otherAnsweredQs = new Array<Question>(); }

  ngOnInit() {
  }

  sortQuestions(questions: Question[]){
    for (let question of questions){
      if(question.isAnswered){
        if (question.faq){
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
      else if(question.claimedBy.id === this.currentUser.id ){//question.status === "claimed"){ //assinged to or claimed by me
        this.myQs.push(question);
      }
      else{
        this.unclaimedQs.push(question);
      }
    }
  }

}
