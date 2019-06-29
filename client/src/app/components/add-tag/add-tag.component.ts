import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {

  @Input() private currentQuestion : Question;
  private tagText: string;
  constructor() { }

  ngOnInit() {
  }

  addTag(){
    this.currentQuestion.addTag(this.tagText);
  }
}
