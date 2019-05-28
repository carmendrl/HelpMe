import { Component, OnInit } from '@angular/core';
import { Course } from'../models/course.model';
import { CourseService } from '../services/course.service';
import { DatePipe } from '@angular/common';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-course-form',
  templateUrl: './create-course-form.component.html',
  styleUrls: ['./create-course-form.component.scss'],
  providers: [DatePipe]
})
export class CreateCourseFormComponent implements OnInit {
  private todayYear: number;
  subject: string;
  number: string;
  title: string;
  semester: string;
  addedCourse: Course;
  saved: boolean = false;
  closeResult: string;


  constructor(private courseService: CourseService, private modalService: NgbModal,) {  this.getYear(); }

  ngOnInit() {
  }

  createNewCourseFromForm(){
    debugger
    this.saved = true;
    let yearSemester = this.todayYear + this.semester;
    this.courseService.postNewCourse(this.subject, this.number, this.title, yearSemester).subscribe(c => this.addedCourse = c);
    saveCourse();
    }



  private getYear(){
    //debugger
    let date = new Date();
    this.todayYear= date.getFullYear();
}

open(content) {
  //this.sessionStarted =false;
  this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-course'}).result.then((result) => {
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
