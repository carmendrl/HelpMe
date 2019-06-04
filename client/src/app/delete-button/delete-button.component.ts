import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent implements OnInit {
@Input() private currentQuestion : Question;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  delete(question: Question){
    this.questionService.deleteAQuestion(this.currentQuestion).subscribe();

  }
}
