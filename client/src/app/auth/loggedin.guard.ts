import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedinGuard implements CanActivate, CanActivateChild {
	private routesNotRequiringLogin : string[] = [
		"/", "/login", "/users/newuser"
	];

	public urlAfterLogin : string;

	constructor (private userService: UserService, private router : Router) {
		this.urlAfterLogin = "";
	}

	canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	{
		//  Can always go whereever requested if the user is logged in
		//  and, the previous URL should always be cleared out here
		if (this.userService.IsUserLoggedIn) {
			this.urlAfterLogin = '';
			return true;
		}

		//  Check whether route requires login
		let requestUrl = state.url;
		let checkUrl = this.routesNotRequiringLogin.find( r => r === requestUrl);

		//  If we found something in routesNotRequiringLogin, user doesn't have to be
		//  logged in to navigate to the route
		if (checkUrl) {
			return true;
		}

		this.urlAfterLogin = requestUrl;
		return this.router.parseUrl("/login");
  }

	canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	{
		return this.canActivate(next, state);
	}
}
