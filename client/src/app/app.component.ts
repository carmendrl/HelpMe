import { Component } from '@angular/core';
import { RoutingHelperService } from './services/routing-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'app';
	constructor (private routingHelper : RoutingHelperService) {}

}
