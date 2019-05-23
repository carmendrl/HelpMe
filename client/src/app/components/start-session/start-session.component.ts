import { Component, OnInit } from '@angular/core';
import {Course} from '../../models/course.model';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { LabSession } from '../../models/lab_session.model';
import { LabSessionService } from '../../services/labsession.service';
import { Router } from '@angular/router';
import { CourseService } from'../../services/course.service';


@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.component.html',
  styleUrls: ['./start-session.component.scss']
})

export class StartSessionComponent implements OnInit {
  closeResult: string;
  description: string;
  private courseId:number;
  subject: string;
  number: string;
  title: string;
  semester: string;
  year:string;
  private startCourse : Course[];

  constructor(private router : Router, private labSessionService: LabSessionService, private modalService: NgbModal, private courseService: CourseService) {
  }

  ngOnInit() {
    this.courseService.coursesList().subscribe(
      courses => this.startCourse = courses);
  }

  OnSubmit(){
    debugger
    this.labSessionService.createNewLabSession(this.description, this.courseId).subscribe(
      r => {
        if (r) {
          //this.router.navigateByUrl('/lab_sessions');     //this will have to change
        }
      }
    );

  }

  createNewSession(){
    let yearSemester = this.semester + this.year;
    this.courseService.createNewCourse(this.subject, this.number, this.title, yearSemester)
  }

  open(content) {
    debugger
    this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-session'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log("Testing Modal");
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
