import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCodeDialogComponentComponent } from './qrcode-dialog-component.component';

describe('QRCodeDialogComponentComponent', () => {
  let component: QRCodeDialogComponentComponent;
  let fixture: ComponentFixture<QRCodeDialogComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QRCodeDialogComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRCodeDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
