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

	private currentUrl: string; //the url of the current page
	private lastURL: string; //the url of the page that was visited right before the current one

	constructor(private router: Router) {
		//finds the url of the page
		this.router.events.pipe(
			filter(event => event instanceof NavigationStart)
		).subscribe(
			e => {
				let navigationEvent = <NavigationStart>e;
				console.log(e);
				this.lastURL = this.currentUrl; //sets the lastUrl to the current page
				this.currentUrl = navigationEvent.url;  //sets the next url to the url of the next page visited
				console.log(`RouterHistoryService: Set lastURL to ${this.lastURL} and currentURL to ${this.currentUrl}`);
			}
		);
	}

	get PreviousURL(): string {
		return this.lastURL;
	}

	get DashboardURL(): string {
		return "/dashboard";
	}

	//sends the user to the dashboard
	goToDashboard(): void {
		this.router.navigateByUrl(this.DashboardURL);
	}

	//go to the page to confirm promotion requests
	goToConfirmPromotionRequests(): void {
		this.router.navigateByUrl(this.ConfirmPromotionRequestsURL);
	}

	//the url of the promotion requests page
	get ConfirmPromotionRequestsURL(): string {
		return "/users/confirm-promotions";
	}

	//the labsession url destination for the QR code
	qrCodeDestinationForSession(session: LabSession) {
		return `${environment.server}/dashboard?token=${session.token}`
	}
}
