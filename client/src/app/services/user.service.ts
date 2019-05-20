import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';
import { map, catchError, tap } from 'rxjs/operators';

import { API_SERVER } from '../app.config';
import { User } from '../models/user.model';
import { delay } from 'rxjs/operators';

class UserResponseAttributes {
  public email : string;
  public username : string;
  public lastName : string;
  public firstName : string;
}

class UserResponseData {
  public type : string;
  public id : string;
  public attributes: UserResponseAttributes;
}

class UserResponse {
  constructor (private data : UserResponseData) {
	}
  get Type() : string { return this.data.type }
  get Id() : string { return this.data.id }
  get Email() : string { return this.data.attributes.email }
  get Username() : string { return this.data.attributes.username }
  get FirstName () : string { return this.data.attributes["first-name"] }
  get LastName () : string { return this.data.attributes["last-name"] }
}

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

  login (emailAddress : string, password : string) : Observable<boolean> {
    let url : string =`${this.apiHost}/users/sign_in`;
    let body = {
      email: emailAddress,
      password: password
    };

    return this.httpClient.post<UserResponseData>(url, body).pipe(
      delay(20000),
      tap(r => this.updateLoggedInUserFromResponse(new UserResponse(r["data"]))),
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
    return this.httpClient.post<UserResponseData>(url, body).pipe(
      tap(r => this.updateLoggedInUserFromResponse(new UserResponse(r["data"]))),
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

  private updateLoggedInUserFromResponse(r : UserResponse) {
      debugger
      let user = new User();
      user.Type = r.Type;
      user.FirstName = r.FirstName;
      user.LastName = r.LastName;
      user.Username = r.Username;
      user.EmailAddress = r.Email;
      this._currentUser$.next(user);
  }

  private handleCreateAccountError (error) : Observable<boolean> {
    debugger
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
