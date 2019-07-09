import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import { AudioService } from '../../services/audio.service';
import { LabSessionService } from '../../services/labsession.service';
import { UserService } from '../../services/user.service';
import { Observable, of, from } from 'rxjs';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import {EditModalComponent} from '../edit-modal/edit-modal.component';
import {AnswerModalComponent} from '../answer-modal/answer-modal.component';
import {AssignModalComponent} from '../assign-modal/assign-modal.component';
import {DeleteModalComponent} from '../delete-modal/delete-modal.component';
import { ApiResponse } from '../../services/api-response';
import * as moment from 'moment';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  private timeDifference:string;

  //Each question has own selected action and determinant of whether the answer is showing or not
  private selectedAction: Array<string>;
  public toggleAnswer: Array<boolean>;
  public selected: Array<boolean>;

  private currentUser : User;
  private currentQuestion: Question;
  private actions;
  private closeResult: string;
  private editText : string;
  private answerText:string;
  private searchText:string;
  private step: string;
  private i:number; //number of the question in the list
  private tagText: string;

  //this variable helps when the dropdown menu is in use.
  private actionSelected:boolean =false; // Because the action of the button happens before the action of the menu closing, this helps make sure that when the menu closes it doesn't interfere with the refresh status for the element.
  private copied: boolean;

  //for error handling
  private state: string;
  private errorBoolean: ApiResponse<boolean>;
  private loadBoolean: boolean;
  private booleanMessage: string[];
  private loadBooleanError: boolean;

  @Input() private questions : Question[];
  @Input() private filteredQuestions : Question[];
  @Input() private currentDate: Date;
  @Input() private header: string; //the title of the list - ex:My Questions

  //boolean values that determine whether or not a feature is showing
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
  @Input() private showAddTag: boolean = false;
  @Input() private showClaimedBy: boolean = false;
  @Input() private showSearch : boolean = true;
  @Input() private showCheck: boolean = false;
  @Input() public showFinishButton: boolean = true;
  @Input() public showDiscardDraftButton: boolean = true;


  @Input() public isCollapsed: boolean = true;//is the questionlist collapsed?
  @Input() private readOnly: boolean = false; //is true if the session has ended
  @Input() private allowSelection: boolean = false;
  @Input() private isCollapsible: boolean = true;
  @Input() public answer : Answer;
  @Input() private playSound: boolean =false; //is the sound on?

  //output events to alert other componenets
  @Output() public refreshEvent: EventEmitter<any> = new EventEmitter(); //refresh page
  @Output() public pauseRefresh: EventEmitter<any> = new EventEmitter(); //page the automatic refresh
  @Output() public claimedQEvent: EventEmitter<any> = new EventEmitter(); //a question was claimed
  @Output() public openCloseEvent: EventEmitter<any> = new EventEmitter();//the list was opened or closed

  @Output() public selectionChanged: EventEmitter<Question[]> = new EventEmitter<Question[]> (); //the question that was selected changed

  constructor(private questionService: QuestionService, private labsessionService: LabSessionService, private userService: UserService,
    private audioService: AudioService, private modalService: NgbModal) {

      //load the current user
      this.userService.CurrentUser$.subscribe(
        u => this.currentUser = u);

        //list of "actions" that corespond to actions that can be taken by the user or are used otherwise
        this.actions = {
          "answer": this.answerQuestion,
          "edit": this.editQuestion,
          "finish": this.finishDraft,
          "discardAnswer": this.deleteAnswer,
          "claim": this.claimQuestion,
          "unclaim": this.unclaimQuestion,
          "assign": this.assignQuestion,
          "removeFaQ": this.removeFaqQuestion,
          "addFaQ": this.addFaqQuestion,
          "delete": this.deleteQuestion,
          "meToo": this.meTooQuestion,
          "questionService": this.questionService, //not an action but required for others to work
          "labsessionService": this.labsessionService, //not an action be required for others to work
          "modalService":this.modalService, //not an action but required for others to work
          "openEdit":this.openEdit,
          "openAnswer":this.openAnswer,
          "openAssign":this.openAssign,
          "openDelete":this.openDelete,
          "currentUser": this.currentUser,
          "copy": this.copy,
          "refreshData": this.refreshData, //not an action taken by user but used in features
          "refreshEvent": this.refreshEvent, //not an action taken by user but used in features
          "setPauseRefresh":this.setPauseRefresh, //not an action taken by user but used in features
          "pauseRefresh": this.pauseRefresh, //not an action taken by user but used in features

        }
      }

      ngOnInit() {
        this.selectedAction = new Array<string>();
        this.toggleAnswer = new Array<boolean>();
        this.selected = new Array<boolean> (this.filteredQuestions.length);
        this.selected.fill (false);
      }

      //if select allowed make the font size bigger
      headerStyles() {
        let size : string = this.allowSelection ? "150%" : "100%";
        return {
          "font-size": size
        };
      }

      //the time that the question has been in the queue
      private timeDiff(question: Question) : string{
        return this.timeDifference = moment(question.date).fromNow();
      }

      //create a formatted question for the mobile view
      private stepTextTime(question: Question): Object[]{
        console.log();
        let tempArray = new Array<Object>();
        this.timeDifference = moment(question.date).fromNow();
        tempArray.push(question.text);
        //tempArray.push(JSON.parse('{"insert": this.timeDifference}'));
        this.step = question.step;
        return tempArray;
      }

      //check if the list is collapsed or not
      checkIfCollapsed():string{
        return this.isCollapsed ? "Open": "Close";
      }

      //open/close the list
      checkCollapsed():boolean{
        this.isCollapsed = !this.isCollapsed;
        return this.isCollapsed;
      }

      //get the number of questions
      filteredQuestionsLength():number{
        if(this.filteredQuestions == undefined){
          return 0;
        }
        else{
          return this.filteredQuestions.length;
        }
      }

      //show/hide answer
      doToggleAnswer(i:number){
        //true means answer is showing
        //false means answer is hidden
        if(this.toggleAnswer[i] != undefined){
          this.toggleAnswer[i] = !(this.toggleAnswer[i]);
        }
        else{
          this.toggleAnswer[i] = true;
        }
      }

      //label the button to open and close answer in mobile view
      answerLabel(i:number):string{
        //true means answer is showing
        //false means answer is hidden
        if(this.toggleAnswer[i] == true){
          return "Close Answer";
        }
        else{
          return "View Answer";
        }
      }

      //filter the questions in order to search for similar questions
      filter():boolean{
        if( this.searchText !=undefined && this.searchText!=""){
          return true;
        }
        else{
          return false;
        }
      }

      //output an event when the selected question changes
      onQuestionSelectedChanged () {
        let selectedQuestions : Question[] = this.filteredQuestions.filter (
          (e, index) => this.selected[index]
        );

        this.selectionChanged.emit (selectedQuestions);
      }

      //unselect a question
      unselect (i : number) : void {
        this.selected[i] = false;
        this.onQuestionSelectedChanged();
      }

      //checks to see if the answer is undefined
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

      //main method for all buttons and the dropdown menu
      performSelectedAction(q: Question, i: number){
        this.currentQuestion = q;
        this.setPauseRefresh(true); //pause refresh while action takes place
        this.actions[this.selectedAction[i]](q).subscribe(r => {this.setPauseRefresh(false); this.refreshData(r);
          if (this.selectedAction[i] ==="claim") {this.scrollToClaimedQ()};
          this.selectedAction[i]="";});
          if(this.playSound){this.audioService.playSilentAudio();}
        }

        //an action has been selected
        performMenuAction(q: Question, i: number, action : string){
          this.actionSelected = true;
          this.performAction(q, i, action);
        }

        //set the action which is taking place
        performAction (q: Question, i:number, action : string) {
          this.selectedAction[i] = action;
          this.performSelectedAction(q, i);
        }

        //turn on the automatic refresh
        refreshData(r :any){
          this.refreshEvent.next(r);

        }

        //pause the automatic refresh
        setPauseRefresh(r: boolean){
          //allow for refresh to be paused (true)
          //or for it to be unpause (false)
          this.pauseRefresh.next(r);
        }

        //emitt event that a question has been claimed
        scrollToClaimedQ(){
          this.claimedQEvent.next();
        }

        //configure pauseRefresh based on the position of the dropdown
        menuPauseRefresh(event){
          if(event){
            //dropdown open
            this.pauseRefresh.next(true);
          }
          else{
            //dropdown closed and another action was not selected
            if(!(this.actionSelected)){
              this.pauseRefresh.next(false);
              //this is necesssary so that timer is initiated once again
              this.refreshEvent.next();
            }
            this.actionSelected = false;
          }
        }

        //open the answer modal
        answerQuestion(question: Question):Observable<any>{
          return this.openAnswer(AnswerModalComponent, question);
        }
        //open the edit question modal
        editQuestion(question: Question):Observable<any>{
          return this.openEdit(EditModalComponent, question);
        }
        //open the edit question modal
        finishDraft(question:Question): Observable<any>{
          return this.openEdit(EditModalComponent, question);
        }
        //claim a question
        claimQuestion(question: Question):Observable<any>{
          return this.questionService.claimAQuestion(question);
        }
        //unclaim a question
        unclaimQuestion(question: Question):Observable<any>{
          return this.questionService.unclaimAQuestion(question);
        }
        //open the assign question modal
        assignQuestion(question: Question):Observable<any>{
          return this.openAssign(AssignModalComponent, question);
        }
        //update a question's faq status in order to add it to the faq list
        addFaqQuestion(question: Question):Observable<any>{
          return this.questionService.updateQuestion(question, question.text, true);
        }
        //update a question's faq status in order to remove it from the faq list
        removeFaqQuestion(question: Question):Observable<any>{
          return this.questionService.updateQuestion(question, question.text, false);
        }
        //open the delete question modal
        deleteQuestion(question: Question):Observable<any>{
          return this.openDelete(DeleteModalComponent, question);
        }
        //update the askers of a question to also have the current user
        meTooQuestion(question: Question):Observable<any>{
          return this.questionService.addMeToo(question, true, this.currentUser);
        }
        //delete a draft of an answer on a question
        deleteAnswer(question: Question){
          return this.questionService.deleteADraft(question);
        }
        //copy current question in order to move it to another session
        copy(question: Question){
          this.labsessionService.copyQuestions.push(question);
          this.copied = true;
        }

        //select all of the questions
        selectAll(event){
          let isSelected : boolean = event.srcElement.checked;
          this.selected.fill(isSelected);
          this.onQuestionSelectedChanged();
        }

        //add a tag to a question
        //does not work
        addTag(){
          this.questionService.addATag(this.currentQuestion, this.tagText).subscribe(r => this.handleAddTagResponse(r));
          this.currentQuestion.addTag(this.tagText);
        }
        //get the text of the answer to the current question
        getAnswerText(question : Question): string{
          if(question.answer != undefined){
            if (question.answer.submitted){ //only get if the answer was submitted
              return question.answer.text;
            }
            else{
              return "draft";
            }
          }
          return "";
        }

        //open the modal to add a tag
        openTag(content, question: Question) {
          //debugger;
          this.currentQuestion = question;
          let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-add-tag'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
          console.log("Testing Modal");
          // this.courseService.newCourse$.subscribe(
          //   course => this.modalService.dismissAll()
          // );
        }

        //set teh reason that the modal closed
        private getDismissReason(reason: any): string {
          if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
          } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
          } else {
            return  `with: ${reason}`;
          }
        }

        //open edit Modal
        openEdit(content, question: Question):Observable<any>{
          let modal = this.modalService.open(content,
            <NgbModalOptions>{
              ariaLabelledBy: 'modal-edit-answer',
            });
            modal.componentInstance.currentQuestion = question;
            modal.componentInstance.answererId = this.currentUser.id;
            modal.result.then(
              (result) => {
                this.setPauseRefresh(false);
                this.refreshData(result);
              }, (reason) => {
                this.setPauseRefresh(false);
                this.refreshData(reason);
              }
            );
            return from(modal.result);
          }


          //open Assign modal
          openAssign(content, question:Question):Observable<any> {
            let modal= this.modalService.open(content, <NgbModalOptions>{
              ariaLabelledBy: 'modal-create-course'});
              modal.componentInstance.currentQuestion = question;
              modal.result.then(
                (result) => {
                  this.setPauseRefresh(false);
                  this.refreshData(result);
                }, (reason) => {
                  this.setPauseRefresh(false);
                  this.refreshData(reason);
                }
              );
              return from(modal.result);
            }

            //open Answer modak=l
            openAnswer(content, question: Question):Observable<any>{
              let modal= this.modalService.open(content,
                <NgbModalOptions>{ariaLabelledBy: 'modal-create-answer', });
                modal.componentInstance.currentQuestion = question;
                modal.result.then(
                  (result) => {
                    this.setPauseRefresh(false);
                    this.refreshData(result);
                  }, (reason) => {
                    this.setPauseRefresh(false);
                    this.refreshData(reason);
                  }
                );
                return from(modal.result);
              }

              //Open delete modal
              openDelete(content, question: Question):Observable<any>{
                //debugger;
                let modal= this.modalService.open(content,
                  <NgbModalOptions>{ariaLabelledBy: 'modal-delete-qus', });
                  modal.componentInstance.currentQuestion = question;
                  modal.result.then(
                    (result) => {
                      this.setPauseRefresh(false);
                      this.refreshData(result);
                    }, (reason) => {
                      this.setPauseRefresh(false);
                      this.refreshData(reason);
                    }
                  );
                  return from(modal.result);
                }

                //was the answer submitted?
                checkSubmitted(question:Question){
                  if (question.answer != undefined){
                    if(question.answer.submitted){
                      return false;
                    }
                    else{
                      return true;
                    }
                  }
                  return false;
                }

                //error handling
                private handleAddTagResponse(b: ApiResponse<boolean>){
                  //debugger;
                  if(!b.Successful){
                    this.state = "errorAddingTag";
                    this.errorBoolean = b;
                    this.loadBoolean = <boolean>b.Data;
                    this.booleanMessage = b.ErrorMessages;
                    this.loadBooleanError = true;
                  }
                  else{
                    this.state = "added";
                    this.loadBoolean = <boolean>b.Data;
                  }
                }
              }
