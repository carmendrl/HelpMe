import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-me-too-button',
  templateUrl: './me-too-button.component.html',
  styleUrls: ['./me-too-button.component.scss']
})
export class MeTooButtonComponent implements OnInit {
  @Input() private currentQuestion : Question;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  addMeToo(){
    this.questionService.addMeToo(this.currentQuestion, true).subscribe();
  }
  //curently unused function (as no button appears for a user to unmetoo a question)
  removeMeToo(){
    this.questionService.addMeToo(this.currentQuestion, false).subscribe();
  }
}
