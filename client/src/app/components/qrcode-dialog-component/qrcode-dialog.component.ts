import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoutingHelperService } from '../../services/routing-helper.service';
import { LabSession } from '../../models/lab_session.model';

@Component({
  selector: 'app-qrcode-dialog-component',
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss']
})
export class QRCodeDialogComponent implements OnInit {

  @Input() private session : LabSession; //the current labsession

  @ViewChild('qrcode', {static : false})
  private qrCodeImage : any; //the QR code

  public qrCodeCopiedSuccessfully : boolean; //was the QR code copied sucessfully?

  //get the location for the QR code
  get qrCodeDestination() : string {
    return this.routingHelperService.qrCodeDestinationForSession(this.session);
  }

  constructor(@Inject(DOCUMENT) public document: Document, private routingHelperService : RoutingHelperService, private activeModal : NgbActiveModal) { }

  ngOnInit() {
  }

  //copy the QR code to the clipboard
  copyQRCode(){
    let img = this.qrCodeImage.el.nativeElement.getElementsByTagName("img")[0];
    let r = this.document.createRange();
    r.selectNode(img);
    let sel = window.getSelection();
    sel.addRange(r);
    this.document.execCommand('Copy');
    this.qrCodeCopiedSuccessfully = true;
  }

  //close the modal
  close () : void {
    this.activeModal.close('');
  }
}
