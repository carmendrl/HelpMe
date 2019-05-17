import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { ModelFactoryService } from './model-factory.service';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class QuestionService {

  private userQuestions : Question[];

  constructor(private _modelFactory: ModelFactoryService) {
    this.userQuestions = new Array<Question> ();
    let question1 = new Question();
    question1.text = "How do I center an image on a page?";
    question1.answer = "You can use the max-auto Bootstrap class";
    question1.session = _modelFactory.labSession1;
    question1.date = new Date("January 9, 2018");

    let question2 = new Question();
    question2.text = "How come the template {user.name} doesn't work?";
    question2.answer = "In Angular templates two curly braces are used instead of one";
    question2.session = _modelFactory.labSession2;
    question2.date = new Date("January 11, 2018");

    this.userQuestions.push(question1);
    this.userQuestions.push(question2);
  }

  get myQuestions() : Observable<Question[]> {
    return Observable.of(this.userQuestions);
  }

}
