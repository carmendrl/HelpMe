import { Component, OnInit, Input, Inject } from '@angular/core';
import {DOCUMENT} from '@angular/common';
import { LabSession } from '../../models/lab_session.model';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit {

  @Input() private sessions : LabSession[];
  @Input() private label : string = "Matching Sessions";
  constructor(@Inject(DOCUMENT) public document: Document) { }

  ngOnInit() {
  }


  copySessionCode(s:LabSession){
    let selBox = this.document.createElement('textarea');
    selBox.value=s.token;
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);
  }

  copySessionLink(s:LabSession){
    let selBox = this.document.createElement('textarea');
    let url ="www.YouDidIT....."+s.id+".....com";
    selBox.value=url; ///////NEED TO CHANGE THIS TO URL TO GO TO SESSION
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);
  }


}
