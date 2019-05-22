import { Component, OnInit } from '@angular/core';
import { LabSession } from '../../models/lab_session.model';
import { LabSessionService } from '../../services/labsession.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.component.html',
  styleUrls: ['./start-session.component.scss']
})
export class StartSessionComponent implements OnInit {

private description: string;
private courseId:number;
  constructor(private router : Router, private labSessionService: LabSessionService) {
  }

  ngOnInit() {
  }

  OnSubmit(){
    this.labSessionService.createNewLabSession(this.description, this.courseId).subscribe(
      r => {
        if (r) {
          //this.router.navigateByUrl('/lab_sessions');     //this will have to change
        }
      }
    );

  }

}
