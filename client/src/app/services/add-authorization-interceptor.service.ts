import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { filter, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { environment } from '../../environments/environment';

@Injectable()
export class AddAuthorizationInterceptorService implements HttpInterceptor {

	private token: string;
	private client: string;
	private uid: string;

	constructor(private userService: UserService, @Inject(environment["local_storage_mode"]) private localStorage: StorageService) {
		let authInfo = this.localStorage.get("AUTH_INFO");
		if (authInfo) {
			console.log("Restoring auth info from local storage to interceptor");
			this.token = authInfo["token"];
			this.client = authInfo["client"];
			this.uid = authInfo["uid"];
		}
		else {
			console.log("AuthInterceptor:  No saved information found in local storage");
		}
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		//  If we're signing in or creating an account, we'll need to observe the response which will have
		//  the headers in it
		let createAccountRegEx = RegExp("\/users(\\?.*)?$")

		let creatingTA: boolean = request.url.endsWith('?accountType=ta');

		// let creatingAccount : boolean = request.url.endsWith("/users") && request.method === "POST";
		let creatingAccount: boolean = createAccountRegEx.test(request.url) && request.method === "POST";
		let signingIn: boolean = request.url.endsWith("/users/sign_in") && request.method === "POST";

		if ((creatingAccount && !creatingTA) || signingIn) {
			return next.handle(request).pipe(
				filter(e => e instanceof HttpResponse),
				tap(e => this.setAccessTokensFromResponse(<HttpResponse<any>>e))
			);
		}

		//  All other requests will require us to provide credentials
		let newRequest = request.clone({
			headers: request.headers.set('uid', this.uid).set('client', this.client).set('access-token', this.token)
		});

		//  If we're logging out, we need to listen for the response to clear out
		//  the credentials
		if (request.url.endsWith("/users/sign_out")) {
			return next.handle(newRequest).pipe(
				filter(e => e instanceof HttpResponse),
				tap(e => this.clearAccessTokens(<HttpResponse<any>>e))
			)
		}

		//  Otherwise, just forward the request normally and we're done with it
		return next.handle(newRequest);
	}

	private setAccessTokensFromResponse(r: HttpResponse<any>) {
		this.uid = r.headers.get("uid");
		this.client = r.headers.get("client");
		this.token = r.headers.get("access-token");

		//  Save these values into local storage as a single object
		let authInfo = {
			uid: this.uid,
			client: this.client,
			token: this.token
		};

		this.localStorage.set("AUTH_INFO", authInfo);
		console.log("Setting AUTH_INFO information in local storage");
	}

	private clearAccessTokens(r: HttpResponse<any>) {
		this.uid = undefined;
		this.client = undefined;
		this.token = undefined;

		this.localStorage.remove("AUTH_INFO");
		console.log("Clearing AUTH_INFO information from local storage");
	}
}
