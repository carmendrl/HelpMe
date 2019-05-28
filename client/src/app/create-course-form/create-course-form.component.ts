import { Component, OnInit } from '@angular/core';

import { CourseService } from '../services/course.service';
import { DatePipe } from '@angular/common';


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


  constructor(private courseService: CourseService) {  this.getYear(); }

  ngOnInit() {
  }

  createNewCourseFromForm(){
    debugger
    let yearSemester = this.todayYear + this.semester;
    return this.courseService.postNewCourse(this.subject, this.number, this.title, yearSemester).subscribe();
    }



  private getYear(){
    //debugger
    let date = new Date();
    this.todayYear= date.getFullYear();
}

}
