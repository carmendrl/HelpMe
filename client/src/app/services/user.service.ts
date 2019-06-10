import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';

import { API_SERVER } from '../app.config';
import { User } from '../models/user.model';
import { Question } from '../models/question.model';


@Injectable()
export class UserService {
  private _currentUser$: Subject<User>;
  private apiHost : string;

  private noUser : User;

  constructor (private httpClient : HttpClient, @Inject(API_SERVER) host : string) {
      this._currentUser$ = new ReplaySubject<User> (1);
      this.apiHost = host;
      this.noUser = new User ();
      this.noUser.Username = "";
  }

  get CurrentUser$() : Observable<User> {
    return this._currentUser$;
  }

  findUserByEmail (email : string, question: Question) : Observable<User[]> {
			// let me = new User();
			// me.FirstName = 'Ryan';
			// me.LastName = 'McFall';
			// me.EmailAddress = "mcfall@hope.edu";
			// me.id = "1234-abcd";
      //
			// let chuck = new User();
			// chuck.FirstName = 'Charles';
			// chuck.LastName = 'Cusack';
			// chuck.EmailAddress = 'cusack@hope.edu';
			// chuck.id = "5678-efgh";
      //
			// let bill = new User();
			// bill.id = "02d67be7-6999-4eb7-b216-ca1163d8f70c"
			// bill.FirstName = "Bill";
			// bill.LastName = "Gates";
			// bill.EmailAddress = "billg@microsoft.com";
      let url: string = `${this.apiHost}/lab_sessions/${question.session.id}`;
      return this.httpClient.get(url).pipe(
        map(r => this.createUserArray(r["included"]))
        // catchError(this.handleError<User[]>(`retrieving users`))
      );

			// let users = [me, chuck, bill];
      //
			// return of(users.filter(element => element.EmailAddress.startsWith(email)));
			//return of(users);
	}

  createUserArray(objects:any[]): User[]{
    let users = new Array<User>();

    //loop through the labsessions and push them onto an array after reformating
    for(let object of objects){

      users.push(this.buildCreateUserFromJson(object));

    }
    return users;
  }

    private buildCreateUserFromJson(s: Object) : User {
      let user = User.createFromJSon(s);

      return user;
    }

  login (emailAddress : string, password : string) : Observable<boolean> {
    let url : string =`${this.apiHost}/users/sign_in`;
    let body = {
      email: emailAddress,
      password: password
    };

    return this.httpClient.post(url, body).pipe(
      //timeout(5000), //possible other way to have login delay messsage possibly displayed.
      //delay(20000), //This is here to test for login delay messages
      tap(r => this.updateLoggedInUserFromResponse(r["data"])),
      map(r => {
        return true
      }),
      catchError(error => this.handleError(error))
    );
  }

  logout () : Observable<boolean> {
    let url : string = `${this.apiHost}/users/sign_out`;
    return this.httpClient.delete(url).pipe(
      tap(r => this._currentUser$.next(this.noUser)),
      map(r => true ),
      catchError(error => of(false))
    );
  }

  createAccount(user : User) : Observable<boolean> {
    let url : string = `${this.apiHost}/users`;
    let body = this.buildCreateAccountBodyFromUser (user);
    return this.httpClient.post(url, body).pipe(
      tap(r => this.updateLoggedInUserFromResponse(r["data"])),
      map(r => true ),
      catchError(error => this.handleCreateAccountError(error))
    );
  }

  private buildCreateAccountBodyFromUser ( u : User) {
    return {
      email: u.EmailAddress,
      first_name: u.FirstName,
      last_name: u.LastName,
      username: u.Username,
      password: u.Password,
      password_confirmation: u.Password,
      type: 'Student'
    }
  }

  private updateLoggedInUserFromResponse(o : Object) {
      this._currentUser$.next(User.createFromJSon(o));
  }

  private handleCreateAccountError (error) : Observable<boolean> {
    if (error instanceof HttpErrorResponse) {
      let httpError = <HttpErrorResponse> error;
      let errorMessage : string = "The account was not created for the following reasons:";
      let reasons = error.error.errors.full_messages.join(", ");
      console.log(reasons);
    }
    return of(false);
  }

  private handleError (error) : Observable<boolean> {
    return of(false);
  }
}
