import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-claim-button',
  templateUrl: './claim-button.component.html',
  styleUrls: ['./claim-button.component.scss']
})
export class ClaimButtonComponent implements OnInit {

  @Input() private currentQuestion : Question;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    // this.claim();
  }

  claim(){
    this.questionService.claimAQuestion(this.currentQuestion).subscribe();

  }

  assign(question: Question){ // how will we want to enter the person it is being assigned to?
    this.questionService.claimAQuestion(this.currentQuestion).subscribe();

  }
}
