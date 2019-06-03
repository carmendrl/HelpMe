import { UserService } from './services/user.service';
import { QuestionService } from './services/question.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Question } from './models/question.model';
import { User } from './models/user.model';

export abstract class SessionView {
    questions: Question[];
    currentUser: User;

    constructor(private userService : UserService, protected questionService: QuestionService,  private route: ActivatedRoute, privatelocation: Location) {
      this.questionService.getSessionQuestions(this.route.snapshot.paramMap.get('id')).subscribe(questions => {this.questions = questions; this.sortQuestions(this.questions);});
      this.userService.CurrentUser$.subscribe(
        u => this.currentUser = u
      );

     }

     //want to make this abstract method but must make this an abstract createNewLabSession
     //to make this an abstract class can't have a constructor because can't instantiate
     //an abstract class
       abstract sortQuestions(questions: Question[]); //may switch to specific user attribute such as type or id

}
