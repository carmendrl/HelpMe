import { Component, OnInit, Inject } from '@angular/core';
import { LabSession } from '../../models/lab_session.model';
import { LabSessionService } from '../../services/labsession.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.component.html',
  styleUrls: ['./start-session.component.scss']
})


export class StartSessionComponent implements OnInit {

private description: string;
private courseId:number;
private generatedCode: string;
private generatedId:number;
private sessionStarted: boolean;


  constructor( @Inject(DOCUMENT) public document: Document,
  private router : Router, private labSessionService: LabSessionService, private modalService: NgbModal){

  }

  ngOnInit() {
    this.sessionStarted = false;
  }

  startSession(){
    this.labSessionService.createNewLabSession(this.description, this.courseId).subscribe(
      r => {this.generatedCode = r[0]; this.generatedId=r[1]});
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
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
