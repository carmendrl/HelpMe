import { Component, OnInit, Input, Inject } from '@angular/core';
import {DOCUMENT} from '@angular/common';
import { Router } from '@angular/router';
import { LabSessionService } from '../../services/labsession.service';
import { LabSession } from '../../models/lab_session.model';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit {

  @Input() private sessions : LabSession[];
  @Input() private label : string = "Matching Sessions";

  private searchText: string;

  private copied: boolean = false;
  constructor(@Inject(DOCUMENT) public document: Document,  private router : Router) { }

  ngOnInit() {
  }

  copySessionCode(s:LabSession){
    this.copied = true;
    let selBox = this.document.createElement('textarea');
    selBox.value=s.token;
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);
  }

  copySessionLink(s:LabSession){
    this.copied = true;
    let selBox = this.document.createElement('textarea');
    let url ="www.YouDidIT....."+s.id+".....com";
    selBox.value=url; ///////NEED TO CHANGE THIS TO URL TO GO TO SESSION
    this.document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(selBox);
  }

  viewSession(s:LabSession){
    this.router.navigateByUrl(`/lab_sessions/${s.id}`);
  }

  filter():boolean{
    if( this.searchText !=undefined && this.searchText!=""){
      return true;
    }
    else{
      return false;
    }
  }


}
