import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';

import { CourseService } from '../../services/course.service';


@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.component.html',
  styleUrls: ['./start-session.component.scss']
})
export class StartSessionComponent implements OnInit {

  private startCourses : Course[];

  constructor() { }
private courseService : CourseService
  ngOnInit() {
    this.courseService.coursesList().subscribe(
      courses => this.startCourses = courses
    );
  }

}
