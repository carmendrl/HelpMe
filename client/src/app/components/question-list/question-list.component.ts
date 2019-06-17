import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { Observable, of, from } from 'rxjs';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import {EditModalComponent} from '../edit-modal/edit-modal.component';
import {AnswerModalComponent} from '../answer-modal/answer-modal.component';
import {AssignModalComponent} from '../assign-modal/assign-modal.component';
import * as moment from 'moment';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  private timeDifference:string;
  private selectedAction: string;
  private currentUser : User;
  private currentQuestion: Question;
  private actions;
  private closeResult: string;
  private editText : string;
  private answerText:string;
  private searchText:string;

  @Input() private questions : Question[];
  @Input() private filteredQuestions : Question[];
  @Input() private currentDate: Date;
  @Input() private header: string;
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
  @Input() private showAssignButton: boolean = false;
  @Input() private showFAQButton: boolean = false;
  @Input() private showDeleteButton: boolean = false;
  @Input() private showMeTooButton: boolean = false;
  @Input() private showStep: boolean = true;
  @Input() private showNumberOfAskers: boolean = false;
  @Input() private showUnclaimButton: boolean = false;
  @Input() private showClaimedBy: boolean = false;
  @Input() public isCollapsed: boolean = true;

  @Output() public refreshEvent: EventEmitter<any> = new EventEmitter();


  constructor(private questionService: QuestionService, private userService: UserService,
    private modalService: NgbModal) {

      this.userService.CurrentUser$.subscribe(
        u => this.currentUser = u);

        this.actions = {
          "answer": this.answerQuestion,
          "edit": this.editQuestion,
          "claim": this.claimQuestion,
          "unclaim": this.unclaimQuestion,
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
          "currentUser": this.currentUser,
        }
      }

      ngOnInit() {
      }

      private timeDiff(question: Question) : string{
        return this.timeDifference = moment(question.date).fromNow();
      }

      checkIfCollapsed():string{
        if(this.isCollapsed){
          return "Open";
        }
        else{
          return "Close"
        }
      }

      filter():boolean{
        if( this.searchText !=undefined && this.searchText!=""){
          return true;
        }
        else{
          return false;
        }
      }


      filteredQuestionsLength():number{
        if(this.filteredQuestions == undefined){
          return 0;
        }
        else{
          return this.filteredQuestions.length;
        }
      }

      answerUndefined(question:Question){
        if(question.answer === undefined){
          return true;
        }
        else if(question.answer.id === undefined){
          return true;
        }
        else{ //meaning answer is defined (completely created once)
          return false;
        }
      }


      setAnswer(){
        this.selectedAction = "answer";
      }
      setEdit(){
        this.selectedAction = "edit";
      }
      setClaim(){
        this.selectedAction = "claim";
      }
      setUnclaim(){
        this.selectedAction = "unclaim";
      }

      setAssign(){
        this.selectedAction = "assign";
      }
      setAddFaq(){
        this.selectedAction = "addFaQ";
      }
      setRemoveFaq(){
        this.selectedAction = "removeFaQ";
      }
      setDelete(){
        this.selectedAction = "delete";
      }
      setMeToo(){
        this.selectedAction = "meToo";
      }
      //methods for select element in drop down menu
      performAction(q: Question){
        this.currentQuestion = q;
        this.actions[this.selectedAction](q).subscribe(r => this.refreshData());
      }

      refreshData(){
        this.refreshEvent.next();
      }

      answerQuestion(question: Question):Observable<any>{
        return this.openAnswer(AnswerModalComponent, question);
      }

      editQuestion(question: Question):Observable<any>{
        return this.openEdit(EditModalComponent, question);
      }

      claimQuestion(question: Question):Observable<any>{
        return this.questionService.claimAQuestion(question);
      }

      unclaimQuestion(question: Question):Observable<any>{
        return this.questionService.unclaimAQuestion(question);
      }

      assignQuestion(question: Question):Observable<any>{
        return this.openAssign(AssignModalComponent, question);
      }

      addFaqQuestion(question: Question):Observable<any>{
        return this.questionService.updateQuestion(question, question.text, true);
      }

      removeFaqQuestion(question: Question):Observable<any>{
        return this.questionService.updateQuestion(question, question.text, false);
      }

      deleteQuestion(question: Question):Observable<any>{
        return this.questionService.deleteAQuestion(question);
      }

      meTooQuestion(question: Question):Observable<any>{
        return this.questionService.addMeToo(question, true, this.currentUser);
      }


      //Edit Modal methods
      openEdit(content, question: Question):Observable<any>{
        let modal = this.modalService.open(content,
          <NgbModalOptions>{
            ariaLabelledBy: 'modal-edit-answer',
          });
          modal.componentInstance.currentQuestion = question;
          modal.componentInstance.answererId = this.currentUser.id;
          return from(modal.result);
        }


        //Assign Modal methods
        openAssign(content, question:Question):Observable<any> {
          let modal= this.modalService.open(content, <NgbModalOptions>{
            ariaLabelledBy: 'modal-create-course'});
          modal.componentInstance.currentQuestion = question;
          return from(modal.result);
        }


        //Answer Modal methods
        openAnswer(content, question: Question):Observable<any>{
          let modal= this.modalService.open(content,
            <NgbModalOptions>{ariaLabelledBy: 'modal-create-answer', });
            modal.componentInstance.currentQuestion = question;
            return from(modal.result);
          }


          // gravatarImageUrl() : string {
          //     //debugger
          //
          //
          //     return `https://www.gravatar.com/avatar/${hashedEmail}?s=40`;
          // }

        }
