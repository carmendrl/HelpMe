import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';

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
  private selectedAction: string;

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
  @Input() private showAssignModal: boolean = false;
  @Input() private showFAQButton: boolean = false;
  @Input() private showDeleteButton: boolean = false;
  @Input() private showMeTooButton: boolean = false;

  constructor(private questionService: QuestionService) { }

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

  //methods for select element in drop down menu
  performAction(question: Question){
    debugger
    if(this.selectedAction ==="addFaQ"){
      this.questionService.updateQuestion(question, question.text, true).subscribe();
    }
    else if(this.selectedAction ==="removeFaQ"){
      this.questionService.updateQuestion(question, question.text, false).subscribe();
    }
    else if(this.selectedAction ==="claim"){
      this.questionService.claimAQuestion(question).subscribe();
    }
    else if(this.selectedAction ==="meToo"){
      this.questionService.addMeToo(question, true).subscribe();
    }
    else if(this.selectedAction ==="delete"){
      this.questionService.deleteAQuestion(question).subscribe();
    }
    else if(this.selectedAction ==="assign"){
      
    }
    else if(this.selectedAction ==="answer"){

    }
    else if(this.selectedAction ==="edit"){

    }

  }

}
