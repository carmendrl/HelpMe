import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent implements OnInit {
  @Input() private currentQuestion : Question;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  editAnswer(text: string){
    this.questionService.editAnAnswer(this.currentQuestion, text).subscribe();
  }

}
