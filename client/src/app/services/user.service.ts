import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';
import { timer, from} from 'rxjs';

import { API_SERVER } from '../app.config';
import { User } from '../models/user.model';
import { PromotionRequest } from '../user-management/models/promotion-request.model';
import { Question } from '../models/question.model';

export class PromoteUserResponse {
	constructor (private _success : boolean, private _errorMessages? : string[]) {
		this._errorMessages = new Array<string> ();
	}

	get Successful () : boolean {
		return this._success;
	}

	set Successful (wasSuccessful : boolean) {
		this._success = wasSuccessful;
	}

	get ErrorMessages () : string[] {
		return this._errorMessages;
	}

	addError (message : string) {
		this._errorMessages.push(message);
	}
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

  createAccount(user : User, requestPromotion: boolean) : Observable<boolean> {
		let url : string = `${this.apiHost}/users?requestPromotion=true`;

    let body = this.buildCreateAccountBodyFromUser (user);
    return this.httpClient.post(url, body).pipe(
      tap(r => this.updateLoggedInUserFromResponse(r["data"])),
      map(r => true ),
      catchError(error => this.handleCreateAccountError(error))
    );
  }

	findUserByEmail (email : string, user_type? : string) : Observable<User[]> {
		let url : string = `${this.apiHost}/system/users/find?q=${email}`;
		if (user_type) {
			url = `${url}&type=${user_type}`;
		}

		return this.httpClient.get(url).pipe(
			map(r => r["data"].map (o => User.createFromJSon(o)))
		)
	}

	requestPromotion ( user : User) : Observable<PromoteUserResponse> {
		let url : string = `${this.apiHost}/promotion_requests`;
		console.log(`Url for request promotion is ${url}`);
		return this.httpClient.post(url, {user_id: user.id}).pipe(
			map (r => new PromoteUserResponse(true)),
			catchError (r => this.handlePromotionRequestError(r))
		);
	}

	loadPromotionRequest ( id : string) : Observable<PromotionRequest> {
		let url : string = `${this.apiHost}/promotion_requests/${id}`;
		return this.httpClient.get(url).pipe (
			map (r => {
					let pr : PromotionRequest = PromotionRequest.createFromJSon(r["data"]);
					let user_id : string = r["data"]["relationships"]["user"]["data"]["id"];
					let user = r["included"].find( e => e["type"] =="students" && e["id"] == user_id);
					pr.User = User.createFromJSon(user);
					let promoted_by_id : string = r["data"]["relationships"]["promoted_by"]["data"]["id"];
					let promoted_by = r["included"].find( e => e["type"] == 'professors' && e["id"] == promoted_by_id);
					pr.PromotedBy = User.createFromJSon(promoted_by);
					return pr;
				}
			)//,
			//catchError (r => this.handlePromotionRequestError(r))
		);
	}

	confirmPromotionRequest (pr : PromotionRequest) : Observable<boolean> {
		let url : string = `${this.apiHost}/promotion_requests/${pr.id}`;
		return this.httpClient.put(url, {}).pipe(
			map (r => true)
		);
	}

	private handlePromotionRequestError (error) : Observable<PromoteUserResponse> {
		if (error instanceof HttpErrorResponse) {
			let response : PromoteUserResponse = new PromoteUserResponse(false);
      error.error.error.errors.forEach (err => response.addError(err.message))
			return of(response);
    }
		return of(new PromoteUserResponse(true));
	}

  private buildCreateAccountBodyFromUser ( u : User) {
    return {
      email: u.EmailAddress,
      first_name: u.FirstName,
      last_name: u.LastName,
      username: u.Username,
      password: u.Password,
      password_confirmation: u.Password,
      type: u.Type
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
