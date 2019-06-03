import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { SessionView } from '../../session-view';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-session-view',
  templateUrl: './student-session-view.component.html',
  styleUrls: ['./student-session-view.component.scss']
})
export class StudentSessionViewComponent extends SessionView implements OnInit {
  @Input() private allQuestions : Question[]
  private faQs: Question[];
  private myQs: Question[];
  private allOtherQs:  Question[];

  constructor(userService: UserService, questionService: QuestionService, route: ActivatedRoute, location: Location) { super(userService, questionService, route, location); this.faQs = new Array<Question>(); this.myQs = new Array<Question>(); this.allOtherQs = new Array<Question>(); }

  ngOnInit() {

  }

  sortQuestions(questions: Question[]){ //need to add some sport of user identification
    for (let question of questions){
      //faq of question is assumed to be a boolean
      if (question.faq){//questions.faq){
        this.faQs.push(question);
      }
      //how this is implemented this depends on how the assinged/claimed/pending variables look
      //as a part of the question model
      //right now assuming that queestions would have the the id of the user that
      //asked the question and would be compared to the current user's id.
      else if(true){//question.asker.id === user.id){ //assinged or claimed by me
        this.myQs.push(question);
      }
      else{
        this.allOtherQs.push(question);
      }
    }
  }

  meToo(question: Question) : void {
    this.myQs.push(question);
  }

}
