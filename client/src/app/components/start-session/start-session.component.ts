import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {NgForm} from '@angular/forms';
import {Course} from '../../models/course.model';
import { LabSession } from '../../models/lab_session.model';
import { LabSessionService } from '../../services/labsession.service';
import { CourseService } from '../../services/course.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.component.html',
  styleUrls: ['./start-session.component.scss'],
})


export class StartSessionComponent implements OnInit {
  closeResult: string;
  private description: string;
  private year: string;
  private startCourse : Course[];
  private generatedCode: string;
  private generatedId:number;
  private sessionStarted: boolean;
  private newSession: LabSession;
  private newCourse: Course;
  private todayYear: number;
  private selectedCourse : Course;
  private addedCourse = false;


  constructor( @Inject(DOCUMENT) public document: Document,
  private router : Router, private labSessionService: LabSessionService, private courseService: CourseService, private modalService: NgbModal){
  }

  ngOnInit() {
    this.sessionStarted = false;
    this.courseService.coursesList().subscribe(
      courses => this.startCourse = courses);
      this.courseService.newCourse$.subscribe(c => {this.startCourse.unshift(c);this.selectedCourse=c;});
    }

  startSession(){
    this.labSessionService.createNewLabSession(this.description, this.selectedCourse.id).subscribe(
      r => {this.newSession = r; this.generatedId= this.newSession.id; this.generatedCode= this.newSession.token});
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

  open(content) {
    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-course'}).result.then((result) => {
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

  saveCourse(){
    this.courseService.newCourse$.subscribe(c => {this.newCourse = c; this.startCourse.unshift(c)});
    this.addedCourse = true;
  }
}
