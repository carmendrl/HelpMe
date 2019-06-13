import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import {EditModalComponent} from '../edit-modal/edit-modal.component'
import {AnswerModalComponent} from '../answer-modal/answer-modal.component'
import {AssignModalComponent} from '../assign-modal/assign-modal.component'
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
          "getDismissReason":this.getDismissReason,
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
        this.actions[this.selectedAction](q);
      }


      answerQuestion(question: Question){
        this.openAnswer(AnswerModalComponent, question);

      }

      editQuestion(question: Question){
        this.openEdit(EditModalComponent, question);

      }
      claimQuestion(question: Question){
        this.questionService.claimAQuestion(question).subscribe();
      }

      unclaimQuestion(question: Question){
        this.questionService.unclaimAQuestion(question).subscribe();
      }

      assignQuestion(question: Question){
        this.openAssign(AssignModalComponent, question);

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
      openEdit(content, question: Question){

        let modal = this.modalService.open(content,
          <NgbModalOptions>{
            ariaLabelledBy: 'modal-edit-answer',
          }
        );

        modal.componentInstance.currentQuestion = question;

        modal.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }


      //Assign Modal methods
      openAssign(content, question:Question) {
        let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-course'});
        modal.componentInstance.currentQuestion = question;
        modal.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  //${this.getDismissReason(reason)}
        });
        console.log("Testing Modal");
      }


      //Answer Modal methods
      openAnswer(content, question: Question){
        let modal= this.modalService.open(content,
          <NgbModalOptions>{ariaLabelledBy: 'modal-create-answer', });
          modal.componentInstance.currentQuestion = question;
          modal.result.then((result) => {
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



        // gravatarImageUrl() : string {
        //     //debugger
        //
        //
        //     return `https://www.gravatar.com/avatar/${hashedEmail}?s=40`;
        // }

      }
