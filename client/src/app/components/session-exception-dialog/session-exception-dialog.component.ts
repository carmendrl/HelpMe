import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-session-exception-dialog',
	templateUrl: './session-exception-dialog.component.html',
	styleUrls: ['./session-exception-dialog.component.scss']
})
export class SessionExceptionDialogComponent implements OnInit {

	@Input()
	private possibleDates: Date[];

  @Input()
  private initialSelectedDates: Date[];

  private selectedDates: Date[];

	constructor(private activeModal: NgbActiveModal) {
    this.selectedDates = new Array<Date>();
  }

	get PossibleDates(): Date[] {
    return this.possibleDates;
	}

  get SelectedDates(): Date[] {
    return this.selectedDates;
  }

	ngOnInit() {
    //  Make a copy of the values provided as input so that the
    //  view showing the exception dates doesn't get updated until
    //  the dialog is closed
    this.initialSelectedDates.forEach(d => this.selectedDates.push(d));
  }

  private findSelectedDateIndex (d: Date) {
    //  Need to use getTime() because otherwise object equality is used, which
    //  doesn't do what we want
    return this.selectedDates.findIndex(date => date.getTime() == d.getTime());
  }

  shouldDateBeSelected(d: Date): boolean {
    let index: number = this.findSelectedDateIndex(d);
    return index != -1;
  }

  onToggleDate(event, d: Date) : void {
    let isSelected = event.srcElement.checked;
    if (isSelected) {
      this.addDate(d);
    }
    else {
      this.removeDate(d);
    }
  }

  addDate(d: Date): void {
    this.selectedDates.push(d);
  }

  removeDate(d: Date): void {
    let i = this.findSelectedDateIndex(d);
    if (i != -1) {
      this.selectedDates.splice(i, 1);
    }
  }

  onAddButtonClicked(): void {
    this.activeModal.close(this.selectedDates);
  }

  onCancelButtonClicked(): void {
    this.activeModal.dismiss(this.selectedDates);
  }
}
