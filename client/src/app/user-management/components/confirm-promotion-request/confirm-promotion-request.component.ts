import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';


import { UserService } from '../../../services/user.service';
import { PromotionRequest } from '../../models/promotion-request.model';

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

	private promotionRequest : PromotionRequest;

  constructor(private route : ActivatedRoute, private userService : UserService) {
		this.routeParamId = "";
		this.state = "unknown";
		this.promotionRequest = new PromotionRequest();
	}

  ngOnInit() {
		// this.routeParams$ = this.route.paramMap.pipe(
		// 	switchMap(params => this.userService.loadPromotionRequest(params.get("request-id")))
		// );
		//
		// this.routeParams$.subscribe(pr => this.requestId = pr.id)
	  this.routeParamId = this.route.snapshot.paramMap.get("request-id");
		if (this.routeParamId) {
			this.state = "loadingRequest";
			this.userService.loadPromotionRequest(this.routeParamId).subscribe (
				pr => {
					this.promotionRequest = pr;
					this.state = "loaded";
				}
			);
		}
  }

	confirmRequest() {
		this.state = "confirmingRequest";
		this.userService.confirmPromotionRequest(this.promotionRequest).subscribe (
			result => this.handleConfirmRequestResponse(result)
		);
	}

	handleConfirmRequestResponse (result : boolean) {
		if (result) {
			this.state = "confirmed";
			// this.pr.user.Type = 'professors';
		}
		else {
			this.state = "errorConfirming";
		}
	}

}
