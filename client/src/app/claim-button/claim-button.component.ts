import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-claim-button',
  templateUrl: './claim-button.component.html',
  styleUrls: ['./claim-button.component.scss']
})
export class ClaimButtonComponent implements OnInit {

  @Input() private newList : Question[];
  @Input() private previousList : Question[];

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    // this.claim();
  }

  claim(question: Question){
    this.questionService.claimAQuestion(question).subscribe();
    this.newList.push(question);//move
    let index = this.previousList.indexOf(question);//delete from unclaimedlist
    this.previousList.splice(index,1);

  }

  assign(question: Question){ // how will we want to enter the person it is being assigned to?
    this.questionService.claimAQuestion(question).subscribe();
    this.newList.push(question);//move
    let index = this.previousList.indexOf(question);//delete from unclaimedlist
    this.previousList.splice(index,1);

  }
}
