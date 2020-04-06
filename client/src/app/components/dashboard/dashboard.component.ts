import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';
import { User } from '../../models/user.model';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	private currentUser: User;
	constructor(private userService: UserService, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle('Dashboard - HelpMe')
	}

}
