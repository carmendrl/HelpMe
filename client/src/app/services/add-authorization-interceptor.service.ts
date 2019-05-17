import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { filter, tap } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable()
export class AddAuthorizationInterceptorService implements HttpInterceptor {

  private token : string;
  private client : string;
  private uid : string;

  constructor(private userService : UserService) { }

  intercept (request : HttpRequest<any>, next : HttpHandler ) : Observable<HttpEvent<any>> {
    //  If we're signing in or creating an account, we'll need to observe the response which will have
    //  the headers in it
    let creatingAccount : boolean = request.url.endsWith("/users") && request.method === "POST";
    let signingIn : boolean = request.url.endsWith("/users/sign_in") && request.method === "POST";

    if (creatingAccount || signingIn) {
      return next.handle(request).pipe (
        filter( e => e instanceof HttpResponse),
        tap (e => this.setAccessTokensFromResponse(<HttpResponse<any>> e))
      );
    }

    //  All other requests will require us to provide credentials
    let newRequest = request.clone({
      headers : request.headers.set('uid', this.uid).set('client', this.client).set('access-token', this.token)
    });

    //  If we're logging out, we need to listen for the response to clear out
    //  the credentials
    if (request.url.endsWith("/users/sign_out")) {
      return next.handle(newRequest).pipe (
        filter (e => e instanceof HttpResponse),
        tap (e => this.clearAccessTokens(<HttpResponse<any>> e))
      )
    }

    //  Otherwise, just forward the request normally and we're done with it
    return next.handle(newRequest);
  }

  private setAccessTokensFromResponse(r : HttpResponse<any>) {
    this.uid = r.headers.get("uid");
    this.client = r.headers.get("client");
    this.token = r.headers.get("access-token");
  }

  private clearAccessTokens (r : HttpResponse<any>) {
    this.uid = undefined;
    this.client = undefined;
    this.token = undefined;
  }
}
