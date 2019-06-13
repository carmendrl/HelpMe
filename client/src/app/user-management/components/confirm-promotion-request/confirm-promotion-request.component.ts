import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';


import { UserService } from '../../../services/user.service';
import { PromotionRequest } from '../../models/promotion-request.model';
import { ApiResponse } from '../../../services/api-response';
@Component({
  selector: 'app-confirm-promotion-request',
  templateUrl: './confirm-promotion-request.component.html',
  styleUrls: ['./confirm-promotion-request.component.scss']
})
export class ConfirmPromotionRequestComponent implements OnInit {

	private routeParams$ : Observable<PromotionRequest>;
	private requestId : string;

	private routeParamId : string;
	private state : string;
	private requestType : string;
	private promotionRequest : PromotionRequest;

	private unconfirmedRequests : PromotionRequest[];
	private confirmedRequests: PromotionRequest[];
	private errorRequests: ApiResponse<PromotionRequest>[];

	private requestSelected : boolean[];
	private selectAllChecked: boolean = false;

	private initCompleted : boolean;

  constructor(private router : Router, private route : ActivatedRoute, private userService : UserService) {
		this.routeParamId = "";
		this.state = "unknown";
		this.promotionRequest = new PromotionRequest();
		this.initCompleted = false;
	}

  ngOnInit() {
		// this.routeParams$ = this.route.paramMap.pipe(
		// 	switchMap(params => this.userService.loadPromotionRequest(params.get("request-id")))
		// );
		//
		// this.routeParams$.subscribe(pr => this.requestId = pr.id)
	  this.routeParamId = this.route.snapshot.paramMap.get("request-id");
		console.log(`URL is ${this.route.snapshot.url}`);

		if (this.routeParamId) {
			this.requestType = 'single';
			this.state = "loadingRequest";
			this.userService.loadPromotionRequest(this.routeParamId).subscribe (
				pr => {
					this.promotionRequest = pr;
					this.state = "loaded";
				}
			);
		}
		else {
			let urlSegments : UrlSegment[] = this.route.snapshot.url;
			let lastSegment : UrlSegment = urlSegments[urlSegments.length-1];
			if (lastSegment.path.endsWith("promotions")) {
				this.requestType = 'multiple';
				this.userService.loadPromotionRequests(true).subscribe( r => {
					if (r.length == 0) {
						this.router.navigateByUrl("/dashboard");
					}
					else {
						this.state = "loaded";
						this.unconfirmedRequests = r;
						this.requestSelected = new Array<boolean> (r.length);
					}
				});
			}
		}
		this.initCompleted = true;
  }

	selectAll () {
		for (let i = 0; i < this.requestSelected.length; i++) {
			this.requestSelected[i] = this.selectAllChecked;
		}
	}

	confirmShouldBeDisabled () : boolean {
		if (this.requestType == 'multiple') {
			return !this.requestSelected.some(e => e);
		}
		else {
			return false;
		}
	}

	confirmRequest() {
		this.state = "confirmingRequest";
		let requestsToBeConfirmed : PromotionRequest[] = [];
		let requestSelected = this.requestSelected;

		if (this.requestType == 'single') {
			requestsToBeConfirmed.push(this.promotionRequest);
		}
		else {
			requestsToBeConfirmed = this.unconfirmedRequests.filter ((element, i) => requestSelected[i]);
		}

		let userServiceRequests : Observable<ApiResponse<PromotionRequest>>[] = requestsToBeConfirmed.map(request => this.userService.confirmPromotionRequest(request));

		//  forkJoin will subscribe to all the requests, and emit a single array value
		//  containing all of the responses
		forkJoin(userServiceRequests).subscribe (
			rArray => this.handleConfirmRequestResponse(rArray)
		);
	}

	private handleConfirmRequestResponse (rArray : ApiResponse<PromotionRequest>[]) {
		if (rArray.some(r => !r.Successful)) {
			this.state = "errorConfirming";
			this.errorRequests = rArray.filter(r => !r.Successful);
			this.confirmedRequests = rArray.filter(r => r.Successful).map(r => <PromotionRequest> r.Data);
		}
		else {
			this.state = "confirmed";
			this.confirmedRequests = rArray.map(r => <PromotionRequest> r.Data);
		}
	}

}
