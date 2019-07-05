import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { LabSession } from '../models/lab_session.model';

@Injectable({
  providedIn: 'root'
})
export class RoutingHelperService {

	private currentUrl : string;
	private lastURL : string;

  constructor(private router : Router) {
		this.router.events.pipe (
			filter (event => event instanceof NavigationStart)
		).subscribe (
			e => {
				let navigationEvent = <NavigationStart> e;
				console.log(e);
				this.lastURL = this.currentUrl;
				this.currentUrl = navigationEvent.url;
				console.log(`RouterHistoryService: Set lastURL to ${this.lastURL} and currentURL to ${this.currentUrl}`);
			}
		);
	}

	get PreviousURL () : string {
		return this.lastURL;
	}

	get DashboardURL () : string {
		return "/dashboard";
	}

	goToDashboard () : void {
		this.router.navigateByUrl(this.DashboardURL);
	}

	goToConfirmPromotionRequests () : void {
		this.router.navigateByUrl(this.ConfirmPromotionRequestsURL);
	}

	get ConfirmPromotionRequestsURL () : string {
		return "/users/confirm-promotions";
	}

	qrCodeDestinationForSession ( session : LabSession) {
		return `${environment.server}/dashboard?token=${session.token}`
	}
}
