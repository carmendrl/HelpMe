import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { LabSession } from '../../models/lab_session.model';
import { LabSessionService } from '../../services/labsession.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.component.html',
  styleUrls: ['./start-session.component.scss']
})

export class StartSessionComponent implements OnInit {
  closeResult: string;
  description: string;
  private courseId:number;
  constructor(private router : Router, private labSessionService: LabSessionService, private modalService: NgbModal, private course: CourseService) {
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

  open(content) {
    this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-session'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
