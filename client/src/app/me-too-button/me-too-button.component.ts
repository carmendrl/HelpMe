import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-me-too-button',
  templateUrl: './me-too-button.component.html',
  styleUrls: ['./me-too-button.component.scss']
})
export class MeTooButtonComponent implements OnInit {
  @Input() private currentList: Question[];
  @Input() private nextList: Question[];

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  addMeToo(question: Question){
    this.questionService.addMeToo(question, true).subscribe();
    this.nextList.push(question);
    let index = this.currentList.indexOf(question);
    this.currentList.splice(index,1);
  }
  removeMeToo(question: Question){
    this.questionService.addMeToo(question, false).subscribe();
    this.nextList.push(question);
    let index = this.currentList.indexOf(question);
    this.currentList.splice(index,1);
  }
}
