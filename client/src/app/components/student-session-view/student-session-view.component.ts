import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { SessionView } from '../../session-view';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';

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

  constructor(userService: UserService, questionService: QuestionService,
    route: ActivatedRoute, location: Location, notifierService: NotifierService) {
      super(userService, questionService, route, location, notifierService);
      this.faQs = new Array<Question>();
      this.myQs = new Array<Question>();
      this.allOtherQs = new Array<Question>();}

      ngOnInit() {
        this.questionService.getUpdatedQuestion$.subscribe(r => this.sortQuestions(this.questions));
        this.questionService.getNewAnswer$.subscribe(r => this.checkNotification(this.questions));
      }

      checkNotification(datas : any){
      for (let data of datas){
        for (let q of this.myQs){
          if(q.id === data.id){
            if(q.answer === undefined){
              if(data.answer != undefined){
                this.notifier.notify('info', 'Your question has been answered!');
                }
              }
            }
          }
        }
      }

      sortQuestions(questions: Question[]){
        //clears the array
        this.faQs.length = 0;
        this.myQs.length = 0;
        this.allOtherQs.length = 0;

        for (let question of questions){
          if(question.id != undefined){
            //faq of question is assumed to be a boolean
            if (question.faq){//questions.faq){
              this.faQs.push(question);
            }
            //how this is implemented this depends on how the assinged/claimed/pending variables look
            //as a part of the question model
            //right now assuming that queestions would have the the id of the user that
            //asked the question and would be compared to the current user's id.
            else if(question.asker.id === this.currentUser.id){ //assinged or claimed by me
              this.myQs.push(question);
            }
            else{
              this.allOtherQs.push(question);
            }
          }
        }
      }

      meToo(question: Question) : void {
        this.myQs.push(question);
      }




    }
