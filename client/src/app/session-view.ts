import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { UserService } from './services/user.service';
import { QuestionService } from './services/question.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Question } from './models/question.model';
import { User } from './models/user.model';
import { Observable, interval, Subscription, timer } from 'rxjs';

export abstract class SessionView  {
  questions: Question[];
  currentUser: User;
  private data : any;
  private questionSubscription : Subscription;
  private timerSubscription : Subscription;

<<<<<<< HEAD
  constructor(private userService : UserService, private questionService: QuestionService,  private route: ActivatedRoute, privatelocation: Location) {
    this.questionService.getSessionQuestions(this.route.snapshot.paramMap.get('id')).subscribe(questions => {this.questions = questions; this.sortQuestions(this.questions);});
    this.userService.CurrentUser$.subscribe(
      u => this.currentUser = u
    );
    this.refreshData();
  }
=======
    constructor(private userService : UserService, protected questionService: QuestionService,  private route: ActivatedRoute, privatelocation: Location) {
      this.questionService.getSessionQuestions(this.route.snapshot.paramMap.get('id')).subscribe(questions => {this.questions = questions; this.sortQuestions(this.questions);});
      this.userService.CurrentUser$.subscribe(
        u => this.currentUser = u
      );
>>>>>>> 3b1e7df010d3e900b7e0546af89ca0db11662d9f

  //want to make this abstract method but must make this an abstract createNewLabSession
  //to make this an abstract class can't have a constructor because can't instantiate
  //an abstract class
  abstract sortQuestions(questions: Question[]); //may switch to specific user attribute such as type or id

  private refreshData(){
    this.questionSubscription = this.questionService.getSessionQuestions(this.route.snapshot.paramMap.get('id')).subscribe(data => {this.data = data; this.sortQuestions(this.data); this.subscribeToData();
    });
  }

  private subscribeToData(){
    this.timerSubscription = timer(3000).subscribe(() => this.refreshData());
  }

  public ngOnDestroy(){
    if (this.questionSubscription){
      this.questionSubscription.unsubscribe();
    }
    if (this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }
  }
}
