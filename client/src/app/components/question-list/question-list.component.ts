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

  @Input() private questions : Question[];
  private filteredQuestions : Question[];

  constructor() { }

  ngOnInit() {
    this.copyAllQuestionsToFilteredQuestions();
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
}
