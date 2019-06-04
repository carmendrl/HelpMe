import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { SessionView } from '../../session-view';
import { Question } from '../../models/question.model';
import { Answer } from '../../models/answer.model';
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
  private otherQs:  Question[];
  private currentQuestion: Question;

  constructor(userService: UserService, questionService: QuestionService,
    route: ActivatedRoute, location: Location) {
      super(userService, questionService, route, location);
      this.unclaimedQs = new Array<Question>();
      this.myQs = new Array<Question>();
      this.faQs = new Array<Question>();
      this.otherQs = new Array<Question>(); }

      ngOnInit() {
        this.questionService.getUpdatedQuestion$.subscribe(r => this.sortQuestions(this.questions));
      }

      sortQuestions(questions: Question[]){
        //clears the array
        debugger
        this.faQs.length = 0;
        this.otherQs.length = 0;
        this.unclaimedQs.length = 0;
        this.myQs.length= 0;

        for (let question of questions){
          if(question.id != undefined){
            if(question.isAnswered){
              if (question.faq){
                this.faQs.push(question);
              }
              else{
                this.otherQs.push(question);
              }
            }
            //how this is implemented this depends on how the assinged/claimed/pending variables look
            //as a part of the question model
            //right now assuming that quesstions would have the the id of the user that
            //claimed/got assigned the question and would be compared to the current user's id.
            else if(question.claimedBy != undefined){
              if(question.claimedBy.id === this.currentUser.id){
                this.myQs.push(question);
              }
              else{
                question.answer = new Answer();
                question.answer.text="This question was claimed by " + question.claimedBy.FullName;
                this.otherQs.push(question);
              }
            }
            else{
              this.unclaimedQs.push(question);
            }
          }
        }
      }


      assign(question: Question, user: User){
        question.claimedBy = user;
      }

      delete(question: Question){

      }
    }
