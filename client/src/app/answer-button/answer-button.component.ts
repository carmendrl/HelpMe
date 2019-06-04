import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-answer-button',
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.scss']
})
export class AnswerButtonComponent implements OnInit {

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  answer(question: Question, text: string){
    this.questionService.answerAQuestion(question, text).subscribe();
  }
}
