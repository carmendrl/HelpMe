import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {Course} from '../../models/course.model';
import { LabSession } from '../../models/lab_session.model';
import { LabSessionService } from '../../services/labsession.service';
import { CourseService } from '../../services/course.service';



@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.component.html',
  styleUrls: ['./start-session.component.scss'],
})


export class StartSessionComponent implements OnInit {
  closeResult: string;
  private description: string;
  private courseId:number;
  private year: string;
  private startCourse : Course[];
  private generatedCode: string;
  private generatedId:number;
  private sessionStarted: boolean;
  private newSession: LabSession;

  private newCourse: Course;

  private todayYear: number;

  private selectedCourse : Course;



  constructor( @Inject(DOCUMENT) public document: Document,
  private router : Router, private labSessionService: LabSessionService, private courseService: CourseService){
  }

  ngOnInit() {
    this.sessionStarted = false;
    this.courseService.coursesList().subscribe(
      courses => this.startCourse = courses; this.selectedCourse = this.startCourse[0]});
    this.courseService.newCourse$.subscribe(c => {this.newCourse = c; this.startCourse.unshift(c)});
  }

  startSession(){
    debugger
    this.labSessionService.createNewLabSession(this.description, this.courseId).subscribe(
      r => {this.newSession = r; this.generatedId= this.newSession.id; this.generatedCode= this.newSession.token});
      debugger

      this.sessionStarted = true;
  }

  copySessionCode(){

    let selBox = this.document.createElement('textarea');
    selBox.value=this.generatedCode;
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);

  }
  copySessionLink(){

    let selBox = this.document.createElement('textarea');
    let url ="www.YouDidIT....."+this.generatedId+".....com";
    selBox.value=url; ///////NEED TO CHANGE THIS TO URL TO GO TO SESSION
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);

  }


  saveCourse(){
    this.courseService.newCourse$.subscribe(c => {this.newCourse = c; this.startCourse.unshift(c)});
}
  createNewCourseFromForm(){
    debugger
    let yearSemester = this.todayYear + this.semester;
    this.courseService.postNewCourse(this.subject, this.number, this.title, yearSemester).subscribe(
      r => this.startCourse.unshift(r));











}
