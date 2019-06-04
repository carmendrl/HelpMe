import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent implements OnInit {
  @Input() currentList: Question[];
  @Input() nextList: Question[];

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  editAnswer(question: Question, text: string){
    this.questionService.editAnAnswer(question, text).subscribe();
    this.nextList.push(question);
    let index = this.currentList.indexOf(question);
    this.currentList.splice(index,1);
  }

}
