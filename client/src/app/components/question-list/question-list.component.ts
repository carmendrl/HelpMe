import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import {EditButtonComponent} from '../edit-button/edit-button.component'



import * as moment from 'moment';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit, AfterViewInit {

  private filterText : string;
  private filterApplied: boolean;
  private timeDifference:string;
  private selectedAction: string;
  private currentUser : User;
  private currentQuestion: Question;
  private actions;
  private closeResult: string;
  private editText : string;
  private answerText:string;
  //private editContent;
  private selectedUser : User = new User();

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
  @Input() private showStep: boolean = true;
  @Input() private showNumberOfAskers: boolean = false;

  // @ViewChild('editContent', {read: ElementRef, static: true})
  // editContent: ElementRef;
  // @ViewChild(EditButtonComponent)
  // editContent:EditButtonComponent

  @ViewChild('trialContent', {read: ElementRef, static: false}) editContent: ElementRef;

  constructor(private questionService: QuestionService, private userService: UserService,
    private modalService: NgbModal) {
    this.userService.CurrentUser$.subscribe(
      u => this.currentUser = u);

      this.actions = {
        "answer": this.answerQuestion,
        "edit": this.editQuestion,
        "claim": this.claimQuestion,
        "assign": this.assignQuestion,
        "removeFaQ": this.removeFaqQuestion,
        "addFaQ": this.addFaqQuestion,
        "delete": this.deleteQuestion,
        "meToo": this.meTooQuestion,
        "questionService": this.questionService,
        "modalService":this.modalService,
        "openEdit":this.openEdit,
        "openAnswer":this.openAnswer,
        "openAssign":this.openAssign,
      }
      this.ngAfterViewInit();
  }

  ngOnInit() {
    this.filterApplied = false;
    this.filterText = "";
  }

  ngAfterViewInit() {
    console.log(`ngAfterViewInit - editContent is ${this.editContent}`);
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
  performAction(q: Question){
debugger
this.currentQuestion = q;
this.actions[this.selectedAction](q);
  }


  answerQuestion(question: Question){

  }

  editQuestion(question: Question){
    debugger
    this.openEdit(this.editContent);

  }
  claimQuestion(question: Question){
    this.questionService.claimAQuestion(question).subscribe();
  }
  assignQuestion(question: Question){

  }
  addFaqQuestion(question: Question){
    this.questionService.updateQuestion(question, question.text, true).subscribe();

  }
  removeFaqQuestion(question: Question){
  this.questionService.updateQuestion(question, question.text, false).subscribe();

  }
  deleteQuestion(question: Question){
    this.questionService.deleteAQuestion(question).subscribe();

  }
  meTooQuestion(question: Question){
    this.questionService.addMeToo(question, true, this.currentUser).subscribe();

  }


//Edit Modal methods

openEdit(content){
  debugger
  let modal = this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-edit-answer'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}

editAnswerFromForm(){
  this.questionService.editAnAnswer(this.currentQuestion, this.editText).subscribe();
}


//Assign Modal methods

findUsers (value$ : Observable<string>){
    return value$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      mergeMap(searchTerm => searchTerm.length < 2 ? of([]) : this.userService.findUserByEmail(searchTerm,this.currentQuestion))
    );
  }

formatUserForTypeAhead (user : User) : string {
  if (user.id=== undefined || user.FullName === "") {
    return "";
  }

  return `${user.FullName} (${user.EmailAddress})`;
}

submitShouldBeDisabled() : boolean {
      return this.selectedUser.id == undefined || this.selectedUser.EmailAddress === "";
  }


openAssign(content) {
  let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-course'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  console.log("Testing Modal");
}



//Answer Modal methods
openAnswer(content){
  let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-answer'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

createAnswerFromForm(){
  this.questionService.answerAQuestion(this.currentQuestion, this.answerText).subscribe();
}




  // gravatarImageUrl() : string {
  //     //debugger
  //
  //
  //     return `https://www.gravatar.com/avatar/${hashedEmail}?s=40`;
  // }

}
