import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Title }     from '@angular/platform-browser';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private userService : UserService, private titleService: Title) { }

  ngOnInit() {
     this.titleService.setTitle('Dashboard - Help Me')
  }

}
