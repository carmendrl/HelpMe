import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-faq-button',
  templateUrl: './faq-button.component.html',
  styleUrls: ['./faq-button.component.scss']
})
export class FaqButtonComponent implements OnInit {
  @Input() private currentList: Question[];
  @Input() private nextList: Question[];

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  addFaQ(question: Question){
    this.questionService.updateQuestion(question, question.text, true).subscribe();
    this.nextList.push(question);
    let index = this.currentList.indexOf(question);
    this.currentList.splice(index,1);
  }

  removeFaQ(question: Question){
    this.questionService.updateQuestion(question, question.text, false).subscribe();
    this.nextList.push(question);
    let index = this.currentList.indexOf(question);
    this.currentList.splice(index,1);
  }
}
