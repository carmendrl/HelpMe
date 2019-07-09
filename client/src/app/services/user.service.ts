import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as HttpStatus from 'http-status-codes';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';
import { map, catchError, tap, delay, timeout, finalize } from 'rxjs/operators';
import { timer, from} from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { User } from '../models/user.model';
import { PromotionRequest } from '../user-management/models/promotion-request.model';
import { Question } from '../models/question.model';
import { ApiResponse } from './api-response';
import { environment } from '../../environments/environment';

//error handling for promoting a user
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
	private _currentUser$: Subject<User>; //observable that has the current user
	private apiHost : string;//base for all urls

	private noUser : User; //is there a user?
	private loggedInUser : User; //the user that is currently logged in

	readonly KEY_USER : string = "USER";

	constructor (private httpClient : HttpClient, @Inject(environment.local_storage_mode) private localStorage : StorageService) {
		this._currentUser$ = new ReplaySubject<User> (1);

		this._currentUser$.subscribe (u => this.loggedInUser = u);

		this.apiHost = environment.api_base;
		this.noUser = new User ();
		this.loggedInUser = this.noUser;
		this.noUser.Username = "";

		console.log ("UserService: looking for user information in local storage");
		//make it so that the user does not have to continously log in
		let previousUser = this.localStorage.get(this.KEY_USER);

		if (previousUser) {
			console.log ("UserService: Found saved user information in local storage");
			console.log (previousUser);
			let u : User = new User();
			u.id = previousUser._id;
			u.FirstName = previousUser._firstName;
			u.LastName = previousUser._lastName;
			u.EmailAddress = previousUser._emailAddress;
			u.Username = previousUser._username;
			u.Type = previousUser._type;
			u.Role = previousUser._role;
			this._currentUser$.next(u);
		}
		else {
			console.log("UserService: No saved user information in local storage");
		}
	}

	//the observable current user
	get CurrentUser$() : Observable<User> {
		return this._currentUser$;
	}

	//checks to see if the user is logged in
	get IsUserLoggedIn() : boolean {
		return this.loggedInUser != this.noUser;
	}

	//log in a user and return the user
	login (emailAddress : string, password : string) : Observable<ApiResponse<User>> {
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
				let user : User = User.createFromJSon(r["data"]);
				return new ApiResponse<User>(true, user)
			}),
			catchError(error => this.handleLoginError(error))
		);
	}

	//log out the user and return a boolean that indicates sucess or failure
	logout () : Observable<ApiResponse<boolean>> {
		let url : string = `${this.apiHost}/users/sign_out`;
		return this.httpClient.delete(url).pipe(
			map( r => {
				let response: ApiResponse<boolean> = new ApiResponse<boolean>(true,true);
				return response;
			}),
			catchError(r => this.handleBooleanUserError(r, false)),
			//  Regardless of success of failure, remove the key that makes it look like the user is
			//  logged in and tell the application that no user is logged in
			finalize( () => {
				console.log("UserService: clearing logged in user");
				this.localStorage.remove(this.KEY_USER);
				this._currentUser$.next(this.noUser);
			}
		)
	);
}

//create a new account
//promotion requests will determine if user is trying to make a professor account
createAccount(user : User, requestPromotion: boolean) : Observable<ApiResponse<User>> {
	let url : string = `${this.apiHost}/users?requestPromotion=${requestPromotion}`;
	let body = this.buildCreateAccountBodyFromUser (user);
	return this.httpClient.post(url, body).pipe(
		tap(r => this.updateLoggedInUserFromResponse(r["data"])),
		map(r => new ApiResponse<User>(true, User.createFromJSon(r["data"]))),
		catchError(error => this.handleCreateAccountError(error))
	);
}

//creates a new user with a role of TA
createTA(user : User) : Observable<ApiResponse<User>> {
	let url : string = `${this.apiHost}/users?accountType=ta`;
	let body = this.buildCreateAccountBodyFromUser(user);
	return this.httpClient.post(url, body).pipe(
		map(r => new ApiResponse<User>(true, User.createFromJSon(r["data"]))),
		catchError(error => this.handleCreateAccountError(error))
	);
}

//promotes an already created user to the role of TA
promoteToTA(user: string){
	let url: string = `${this.apiHost}/system/users/promote`;

	let body = {
		user_id: user
	};
	return this.httpClient.post(url, body).pipe(
		map(r => new ApiResponse<User>(true, User.createFromJSon(r["data"]))),
		catchError(error => this.handlePromoteTAError(error))
	);
}


//changes the user's profile information: email, username, first and lanst name, password
editUserProfile (user:User, email:string, username:string, firstName:string, lastName:string, password:string) : Observable<ApiResponse<User>>{
	let url: string = `${this.apiHost}/users`;

	let body = {
		email: email,
		username: username,
		first_name: firstName,
		last_name: lastName,
		password:password
	};
	return this.httpClient.put(url, body).pipe(
		tap(r => this.updateLoggedInUserFromResponse(r["data"])),
		map(r => new ApiResponse<User>(true, User.createFromJSon(r["data"]))),
		catchError(error => this.handleCreateAccountError(error))
	);
}

//used in searching. Finds users based on their email addresses
findUserByEmail (email : string, user_type? : string) : Observable<ApiResponse<User[]>> {
	let url : string = `${this.apiHost}/system/users/find?q=${email}`;
	if (user_type) {
		url = `${url}&type=${user_type}`;
	}
	var uArray: User[];
	return this.httpClient.get(url).pipe(
		map(r => {
			uArray = url["data"].map (o => User.createFromJSon(o));
			let response : ApiResponse<User[]> = new ApiResponse<User[]>(true, uArray);
			return response;
		}),
		catchError(r => this.handleUsersError(r, uArray))
	)
}

//creates the body to be sent to the server from a user object
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

//uses the currentUser$ observable to update who the logged in user is
private updateLoggedInUserFromResponse(o : Object) {
	let u : User = User.createFromJSon(o);
	console.log("UserService:  Saving logged in user information to local storage");
	this.localStorage.set(this.KEY_USER, u);
	this._currentUser$.next(u);
}


//  This area of the user service deals with promoting users to professors

//creates a new Promotion Request
requestPromotion ( user : User) : Observable<PromoteUserResponse> {
	let url : string = `${this.apiHost}/promotion_requests`;
	console.log(`Url for request promotion is ${url}`);
	return this.httpClient.post(url, {user_id: user.id}).pipe(
		map (r => new PromoteUserResponse(true)),
		catchError (r => this.handlePromotionRequestError(r))
	);
}

//loads a list of all promotion requests
loadPromotionRequests ( unconfirmedOnly : boolean) : Observable<PromotionRequest[]> {
	let unconfirmedString : string = unconfirmedOnly ? 'true' : 'false';
	let url : string = `${this.apiHost}/promotion_requests?unconfirmed=${unconfirmedString}`;
	return this.httpClient.get(url).pipe(
		map( r => r["data"].map(o => this.createSinglePromotionRequestFromJSON(o, r["included"])))
	);
}

//loads a single promotion request
loadPromotionRequest ( id : string) : Observable<PromotionRequest> {
	let url : string = `${this.apiHost}/promotion_requests/${id}`;
	return this.httpClient.get(url).pipe (
		map (r => this.createSinglePromotionRequestFromJSON(r["data"], r["included"]))
		//catchError (r => this.handlePromotionRequestError(r))
	);
}

//creates a promotion requestion when given a json response
private createSinglePromotionRequestFromJSON (r : object, included : object[]) : PromotionRequest {
	let pr : PromotionRequest = PromotionRequest.createFromJSon(r);
	let user_id : string = r["relationships"]["user"]["data"]["id"];
	let user = included.find( e => e["type"] =="students" && e["id"] == user_id);
	pr.User = User.createFromJSon(user);
	let promoted_by_object : string = r["relationships"]["promoted_by"];
	if (promoted_by_object["data"]) {
		let promoted_by_id = promoted_by_object["data"]["id"];
		let promoted_by = included.find( e => e["type"] == 'professors' && e["id"] == promoted_by_id);
		pr.PromotedBy = User.createFromJSon(promoted_by);
	}

	return pr;
}

//confirms a promotion request and thus makes the user with the request a professor
confirmPromotionRequest (pr : PromotionRequest) : Observable<ApiResponse<PromotionRequest>> {
	let url : string = `${this.apiHost}/promotion_requests/${pr.id}`;
	return this.httpClient.put(url, {}).pipe(
		map (r => {
			let pr : PromotionRequest = this.createSinglePromotionRequestFromJSON(r["data"], r["included"]);
			let response : ApiResponse<PromotionRequest> = new ApiResponse<PromotionRequest> (true, pr);
			return response;
		}),
		catchError(r => this.handleConfirmPromotionRequestError(r, pr))
	);
}


//this section is for error handlers
private handleConfirmPromotionRequestError (error : any, pr : PromotionRequest) : Observable<ApiResponse<PromotionRequest>> {
	let apiResponse : ApiResponse<PromotionRequest> = new ApiResponse<PromotionRequest> (false);
	apiResponse.Data = pr;
	if (error instanceof HttpErrorResponse) {
		apiResponse.addErrorsFromHttpError(error);
	}
	else {
		apiResponse.addError("An unkown error occurred");
	}
	return of(apiResponse);
}

private handlePromotionRequestError (error) : Observable<PromoteUserResponse> {
	if (error instanceof HttpErrorResponse) {
		let response : PromoteUserResponse = new PromoteUserResponse(false);
		error.error.error.errors.forEach (err => response.addError(err.message))
		return of(response);
	}
	return of(new PromoteUserResponse(true));
}

private handleBooleanUserError(error: any, b: boolean): Observable<ApiResponse<boolean>>{
	let apiResponse: ApiResponse<boolean> = new ApiResponse<boolean>(false);
	apiResponse.Data = b;
	if(error instanceof HttpErrorResponse){
		apiResponse.addErrorsFromHttpError(error);
	}
	else{
		apiResponse.addError("An unknown error has occured");
	}
	return of(apiResponse);
}

private handleUsersError(error: any, users: User[]): Observable<ApiResponse<User[]>>{
	let apiResponse: ApiResponse<User[]> = new ApiResponse<User[]>(false);
	apiResponse.Data = users;
	if(error instanceof HttpErrorResponse){
		apiResponse.addErrorsFromHttpError(error);
	}
	else{
		apiResponse.addError("An unknown error has occured");
	}
	return of(apiResponse);
}

//handles errors
private handleCreateAccountError (error: any) : Observable<ApiResponse<User>> {
	let apiResponse : ApiResponse<User> = new ApiResponse<User> (false);

	if (error instanceof HttpErrorResponse) {
		let httpError = <HttpErrorResponse> error;
		apiResponse.HttpStatusCode = httpError.status;
		let errorMessage : string = "The account was not created for the following reasons:";
		let reasons = error.error.errors.full_messages.join(", ");
		apiResponse.addError(`${errorMessage} ${reasons}`);
	}
	return of(apiResponse);
}

private handlePromoteTAError(error) : Observable<ApiResponse<User>> {
	let apiResponse : ApiResponse<User> = new ApiResponse<User> (false);

	if (error instanceof HttpErrorResponse) {
		apiResponse.HttpStatusCode = error.status;

		if (error.status == HttpStatus.UNAUTHORIZED) {
			apiResponse.Successful = true;
			return of(apiResponse);
		}
		else {
			apiResponse.addError("An unexpected error occurred while tryign to promote to TA.  If this problem persists, please contact the HelpMe administrators");
			return of(apiResponse);
		}
	}

	return of(apiResponse);
}

private handleLoginError (error) : Observable<ApiResponse<User>> {
	let apiResponse : ApiResponse<User> = new ApiResponse<User> (false);

	if (error instanceof HttpErrorResponse) {
		apiResponse.HttpStatusCode = error.status;

		if (error.status == HttpStatus.UNAUTHORIZED) {
			apiResponse.Successful = true;
			return of(apiResponse);
		}
		else {
			apiResponse.addError("An unexpected error occurred while trying to log you in.  If this problem persists, please contact the HelpMe administrators");
			return of(apiResponse);
		}
	}

	return of(apiResponse);
}


}
