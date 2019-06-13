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
  private isMeTooUser: boolean;
  private faqHeader:string = "Frequently Asked Questions";
  private myQHeader:string = "My Questions";
  private otherQHeader:string = "All Other Questions";

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
              //if your question was answered notification is sent (unless it was answered by yourself)
              if(q.answer === undefined){
                if(data.answer != undefined){
                    if(data.answer.user.id != this.currentUser.id){
                    this.notifier.notify('info', 'Your question has been answered!');
                    }
                }
              }
              //if the answer to your question was editted (but not by yourself)
              // else{
              //   debugger
              //   if(q.answer.text != data.answer.text && data.answer.user.id != this.currentUser.id){
              //     this.notifier.notify('info', 'The answer to your question has been updated.');
              //   }
              // }
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

          this.isMeTooUser=false;

          if(question.id != undefined){
            for (let a of question.otherAskers){
              if(a.id === this.currentUser.id){
                this.isMeTooUser = true;
              }
            }

            if(this.isMeTooUser){
              //assinged or claimed by me (will keep in myQs even if professor makes it a FAQ)
              this.myQs.push(question);
            }
            else if (question.faq){
              this.faQs.push(question);
            }
            else{
              this.allOtherQs.push(question);
            }
          }
        }
      }

    }
