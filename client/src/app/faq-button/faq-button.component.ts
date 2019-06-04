import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-faq-button',
  templateUrl: './faq-button.component.html',
  styleUrls: ['./faq-button.component.scss']
})
export class FaqButtonComponent implements OnInit {
  @Input() private currentQuestion: Question;
  @Input() private currentFaq: boolean; 

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  addFaQ(){
    this.questionService.updateQuestion(this.currentQuestion, this.currentQuestion.text, true).subscribe();
  }

  removeFaQ(question: Question){
    this.questionService.updateQuestion(this.currentQuestion, this.currentQuestion.text, false).subscribe();
  }
}
