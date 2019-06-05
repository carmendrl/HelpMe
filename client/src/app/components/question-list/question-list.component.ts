import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../../models/question.model';

import * as moment from 'moment';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  private filterText : string;
  private filterApplied: boolean;
  private timeDifference:string;

  @Input() private questions : Question[];
  @Input() private filteredQuestions : Question[];
  @Input() private currentDate: Date;
  @Input() private showDate: boolean = false;
  @Input() private showCourse: boolean = false;
  @Input() private showAskedBy: boolean = false;
  @Input() private showTags: boolean = false;
  @Input() private showTimeInQueue: boolean = false;
  @Input() private showAnswer: boolean = true;
  @Input() private showAction: boolean = true;
  @Input() private showAnswerButton: boolean = false;
  @Input() private showEditButton: boolean = false;
  @Input() private showClaimButton: boolean = false;
  @Input() private showFAQButton: boolean = false;
  @Input() private showDeleteButton: boolean = false;
  @Input() private showMeTooButton: boolean = false;

  constructor() { }

  ngOnInit() {
    this.filterApplied = false;
    this.filterText = "";
  }

  filterTextIsEmpty () : boolean {
    if (/\S/.test(this.filterText)) {
      return false;
    }
    return true;
  }

  filter () : void {
    this.filterApplied = true;
    this.filteredQuestions = this.questions.filter(
      q=>this.includeQuestion(q)
    );
  }

  clearFilter () : void {
    this.filterApplied = false;
    this.filterText = "";
    this.copyAllQuestionsToFilteredQuestions();
  }

  private copyAllQuestionsToFilteredQuestions () {
    this.filteredQuestions = this.questions.slice(0, this.questions.length);
  }

  private includeQuestion (question : Question) : boolean {

    //  Look at question text, course, Date
    let regEx : RegExp = new RegExp(`${this.filterText}`, 'i');
    if (regEx.test(question.text)) return true;
    if (regEx.test(question.session.course.subjectAndNumber)) return true;

    //  Create a moment from the date, and format it with full versions
    //  of both the month and the day to allow for searches including
    //  those things
    let fullDate = moment(question.date).format("dddd, MMMM Do YYYY");

    if (regEx.test(fullDate)) return true;

    return false;
  }

  private timeDiff(question: Question) : string{
    return this.timeDifference = moment(question.date).fromNow();
  }
}
