import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { Observable, forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { Course } from '../../models/course.model';
import { LabSession } from '../../models/lab_session.model';
import { LabSessionService } from '../../services/labsession.service';
import { UserService } from '../../services/user.service';
import { CourseService } from '../../services/course.service';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../services/api-response';
import { SessionExceptionDialogComponent } from '../session-exception-dialog/session-exception-dialog.component';

@Component({
	selector: 'app-start-session',
	templateUrl: './start-session.component.html',
	styleUrls: ['./start-session.component.scss'],
})
export class StartSessionComponent implements OnInit {
	closeResult: string; //why the modal swas closed
	private mobile: boolean = false; //is it in mobile view?

	//information about the new session
	private description: string;
	private year: string;
	private startCourse: Course[]; //the list of all courses
	private generatedCode: string;
	private generatedId: string;
	private newSessionDescription: string;
	private newSession: ApiResponse<LabSession>;
	private newCourse: Course;
	private todayYear: number;
	private selectedCourse: Course;
	private fullStartDate: string;
	private fullEndDate: string;
	private start_date: NgbDateStruct; //Date;
	private end_date: NgbDateStruct; //Date
	private start_time: NgbTimeStruct;
	private end_time: NgbTimeStruct;
	private lastRepeatDate: NgbDateStruct;

	private startBeforeEnd: boolean;

	private coursesRetrieved: boolean = false;
	private copied: boolean = false;

	private isRepeatingSession: boolean = false;
	private repeatFrequency: string = 'weekly';

	private sessionExceptions: Date[] = new Array<Date>();

	private descriptionTemplate: string = "Lab {#}";
	private sampleDescription: string = "Lab 1, Lab 2, ..., Lab 15";

	//error handling
	private state: string;
	private errorSession: ApiResponse<LabSession>;
	private createSession: LabSession;
	private sessionMessage: string[];
	private createSessionError: boolean;

	private errorCourses: ApiResponse<Course[]>;
	private getCourses: Course[];
	private courseMessage: string[];
	private getCoursesError: boolean;

	@ViewChild('SingleSessionCreatedDialog', { static: false })
	private singleSessionCreatedDialog;

	@ViewChild('MultipleSessionCreatedDialog', { static: false })
	private multipleSessionCreatedDialog;

	constructor(@Inject(DOCUMENT) public document: Document,
		private router: Router, private labSessionService: LabSessionService, private userService: UserService, private courseService: CourseService, private modalService: NgbModal) {
		// this.addSessionException(new Date());
		// this.addSessionException(new Date(2019, 6, 15));

		//  Moment dates have 0-based months, but the NgbDatePicker months are
		//  1 based.  This is the reason for the +1 in the months settings below
		let today = moment();

		this.start_date = {
			month: today.month() + 1,
			day: today.date(),
			year: today.year()
		};

		this.end_date = {
			month: today.month() + 1,
			day: today.date(),
			year: today.year()
		};

		//  Add 14 here since we are INCLUDING the first session, so a total of 15
		let fifteenthSessionDate = today.add(14, 'weeks');
		this.lastRepeatDate = {
			month: fifteenthSessionDate.month() + 1,
			day: fifteenthSessionDate.date(),
			year: fifteenthSessionDate.year()
		};
	}

	get StartDateAndTimeAsMoment() {
		return moment({
			month: this.start_date.month-1,
			day: this.start_date.day,
			year: this.start_date.year,
			hour: this.start_time.hour,
			minute: this.start_time.minute,
			second: this.start_time.second
		});
	}

	get EndDateAndTimeAsMoment() {
		return moment({
			month: this.end_date.month-1,
			day: this.end_date.day,
			year: this.end_date.year,
			hour: this.end_time.hour,
			minute: this.end_time.minute,
			second: this.end_time.second
		});
	}

	get SessionExceptions(): Date[] {
		//  This sorts by date in ascending order
		return this.sessionExceptions.sort((first: any, second: any) => first - second);
	}

	get PossibleSessionDates(): Date[] {
		let periodMap = {
			"daily": "days",
			"weekly": "weeks",
			"biweekly": "weeks",
			"monthly": "months"
		};

		let periodIncrement: number = this.repeatFrequency === "biweekly" ? 2 : 1;

		let sessionDates: Date[] = new Array<Date>();

		let firstDate = {
			"month": this.start_date.month - 1,
			"date": this.start_date.day,
			"year": this.start_date.year
		};

		let currentDate = moment(firstDate);

		let lastDate = {
			"month": this.lastRepeatDate.month - 1,
			"date": this.lastRepeatDate.day,
			"year": this.lastRepeatDate.year
		}
		let lastSessionDate = moment(lastDate);

		while (currentDate <= lastSessionDate) {
			sessionDates.push(currentDate.toDate());
			currentDate.add(periodIncrement, periodMap[this.repeatFrequency]);
		}

		return sessionDates;
	}

	get ActualSessionDates(): Date[] {
		let sessionDates: Date[] = this.PossibleSessionDates;
		let sessionsWithoutExceptions = sessionDates.filter(d => !this.isException(d));
		return sessionsWithoutExceptions;
	}

	private isException(d: Date): boolean {
		return this.sessionExceptions.findIndex(date => date.getTime() == d.getTime()) != -1;
	}

	get RepeatFrequency(): string {
		return this.repeatFrequency;
	}

	set RepeatFrequency(frequency: string) {
		this.repeatFrequency = frequency;
	}

	get StartMonth(): number {
		return this.start_date.month;
	}

	get StartDay(): number {
		return this.start_date.day;
	}

	get StartYear(): number {
		return this.start_date.year;
	}

	set StartMonth(m: number) { this.start_date.month = m }
	set StartDay(d: number) { this.start_date.day = d }
	set StartYear(y: number) { this.start_date.year = y }

	get EndMonth(): number {
		return this.end_date.month;
	}

	get EndDay(): number {
		return this.end_date.day;
	}

	get EndYear(): number {
		return this.end_date.year;
	}

	set EndMonth(m: number) { this.end_date.month = m }
	set EndDay(d: number) { this.end_date.day = d }
	set EndYear(y: number) { this.end_date.year = y }

	get LastRepeatMonth(): number {
		return this.lastRepeatDate.month;
	}

	get LastRepeatDay(): number {
		return this.lastRepeatDate.day;
	}

	get LastRepeatYear(): number {
		return this.lastRepeatDate.year;
	}

	set LastRepeatMonth(m: number) { this.lastRepeatDate.month = m }
	set LastRepeatDay(d: number) { this.lastRepeatDate.day = d }
	set LastRepeatYear(y: number) { this.lastRepeatDate.year = y }

	get SessionLengthInDays(): number {
		let startMoment = moment(this.start_date);
		let endMoment = moment(this.end_date);
		return endMoment.diff(startMoment, "days");
	}

	private checkBraceStatusInDescriptionTemplate(): string {
		let stack = [];
		for (let character of this.descriptionTemplate) {
			if (character == '{') {
				if (stack[stack.length - 1] == '{') {
					return "{} patterns can not be nested inside of each other";
				}
				stack.push('{');
			}
			else if (character == '}') {
				if (stack.length == 0) {
					return "There is an unmatched { or } in the template";
				}
				stack.pop();
			}
		}
		if (stack.length != 0) {
			return "There is an unmatched { or } in the template";
		}

		return "ok";
	}

	onDescriptionTemplateChanged() {
		let bracesStatus: string = this.checkBraceStatusInDescriptionTemplate();

		if (bracesStatus != "ok") {
			this.sampleDescription = bracesStatus;
			return;
		}

		let pattern = /([\w\s:\(\)\-]*)(\{(.*?)\})?/g;
		let examples: string[] = ["", "", ""];
		examples[0] = this.computeDescriptionFromTemplate(0);
		examples[1] = this.computeDescriptionFromTemplate(1);
		examples[2] = this.computeDescriptionFromTemplate(this.ActualSessionDates.length - 1);

		this.sampleDescription = `${examples[0]}, ${examples[1]}, ..., ${examples[2]}`;
	}

	//  Computes the lab description from the description template, replacing
	//  any patterns as needed
	//  Note that instanceNumber is 0-based
	computeDescriptionFromTemplate(instanceNumber: number): string {
		let pattern = /([\w\s:\(\)\-]*)(\{(.*?)\})?/g;
		let examples: string[] = ["", "", ""];

		let sessionDates = this.ActualSessionDates;

		let dateFormat: string = 'MMM D';

		//let matches = this.descriptionTemplate.matchAll(pattern);

		//  The below is equivalent to the commented out line above;
		//  currently TypeScript doesn't have the "matchAll" function defined
		//  for the string prototype, so doing it like this avoids a TypeScript
		//  compiler error
		let matches = this.descriptionTemplate['matchAll'](pattern);

		let match = matches.next();
		let description: string = "";

		while (!match.done) {
			description += match.value[1];

			if (match.value[3] == "#") {
				description += (instanceNumber + 1);
			}

			if (match.value[3] == 'start') {
				description += moment(sessionDates[instanceNumber]).format(dateFormat);
			}

			if (match.value[3] == 'end') {
				description += moment(sessionDates[instanceNumber]).add(this.SessionLengthInDays, "days").format(dateFormat);
			}
			match = matches.next();
		}
		return description;
	}

	addSessionException(exceptionDate: Date): void {
		this.SessionExceptions.push(exceptionDate);
	}

	removeSessionException(exceptionDate: Date): void {
		let index: number = this.sessionExceptions.indexOf(exceptionDate);
		this.sessionExceptions.splice(index, 1);
	}

	addException(): void {
		let modalRef = this.modalService.open(SessionExceptionDialogComponent, {});
		let startSessionComponent: StartSessionComponent = this;
		modalRef.componentInstance.possibleDates = this.PossibleSessionDates;
		modalRef.componentInstance.initialSelectedDates = this.sessionExceptions;
		modalRef.result.then(
			function(selectedDates) {
				startSessionComponent.sessionExceptions = [];
				selectedDates.forEach(date => startSessionComponent.addSessionException(date))
			}, function() { }
		)
	}

	ngOnInit() {
		this.startBeforeEnd = true;
		//retrieve all the courses
		this.courseService.coursesList().subscribe(
			courses => { this.coursesRetrieved = true; this.startCourse = courses.Data; if (courses.Data.length > 0) { this.selectedCourse = this.startCourse[0]; this.handleGetCoursesError(courses) } });
		this.courseService.newCourse$.subscribe(c => { this.startCourse.unshift(c); this.selectedCourse = c; }); //add new courses to the list
		if (window.screen.width <= 500) { //check to see if the user is in mobile view
			this.mobile = true;
		};
		this.onDescriptionTemplateChanged();
	}

	//handle errors
	private handleGetCoursesError(courses: ApiResponse<Course[]>) {
		if (!courses.Successful) {
			this.state = "errorGettingCourses";
			this.errorCourses = courses;
			this.getCourses = <Course[]>courses.Data;
			this.courseMessage = courses.ErrorMessages;
			this.getCoursesError = true;
		}
		else {
			this.state = "loaded";
			this.getCourses = <Course[]>courses.Data;
		}
	}

	private dateToNgbDateAndTime(d: Date): { date: NgbDateStruct, time: NgbTimeStruct } {
		let ngbDate: NgbDateStruct = {
			month: d.getMonth() + 1,
			day: d.getDate(),
			year: d.getFullYear()
		};

		let ngbTime: NgbTimeStruct = {
			hour: d.getHours(),
			minute: d.getMinutes(),
			second: d.getSeconds()
		};

		return {
			"date": ngbDate,
			"time": ngbTime
		};
	}

	private generateCreateRequestForDate (d : Date, sessionNumber : number) : Observable<ApiResponse<LabSession>> {
		let sessionLength = this.EndDateAndTimeAsMoment.diff(this.StartDateAndTimeAsMoment);

		d.setHours(this.start_time.hour);
		d.setMinutes(this.start_time.minute);
		d.setSeconds(this.start_time.second);

		let dateAndTimeStructs = this.dateToNgbDateAndTime(d);
		let startDateAsString = this.createDateForSubmission(dateAndTimeStructs.date, this.start_time);
		let endDate = moment(d).add(sessionLength).toDate();
		dateAndTimeStructs = this.dateToNgbDateAndTime(endDate);
		let endDateAsString = this.createDateForSubmission(dateAndTimeStructs.date, dateAndTimeStructs.time);
		let description = this.computeDescriptionFromTemplate(sessionNumber);

		return this.labSessionService.createNewLabSession(
			description, this.selectedCourse.id, d, endDate
		);
	}

	//start a create a new session
	startSession() {
		this.createStartEnd()
		this.compareStartEnd();
		if (this.startBeforeEnd) {
			let requests: Observable<ApiResponse<LabSession>>[] = new Array<Observable<ApiResponse<LabSession>>>();

			if (this.isRepeatingSession) {
				//  REVIEW  Could use map for this instead of forEach
				this.ActualSessionDates.forEach((d, index) => {
					let request = this.generateCreateRequestForDate(d, index);
					requests.push(request);
				});
			}
			else {
				let startDate = this.StartDateAndTimeAsMoment.toDate();
				let endDate = this.EndDateAndTimeAsMoment.toDate();
				let request = this.labSessionService.createNewLabSession(
					this.description, this.selectedCourse.id, startDate, endDate/*this.fullStartDate, this.fullEndDate*/
				);
				requests.push(request);
			}

			forkJoin(requests).subscribe(responseArray => {
				if (this.isRepeatingSession) {
					if (!responseArray.some(r => r.Successful == false)) {
						this.modalService.open
						let modal = this.modalService.open(this.multipleSessionCreatedDialog);
					}
				}
				else {
					this.newSession = responseArray[0];
					this.generatedCode = this.newSession.Data.token;
					this.generatedId = this.newSession.Data.id;
					this.newSessionDescription =
						this.newSession.Data.description;
					//  REVIEW  This name is confusing in that it seems to assume that an
					//  error has occurred; also the code above runs regardless of whether
					//  there was an error or not.
					this.handleCreateSessionError(responseArray[0]);
				}
			});
		}
	}

	//handle errors
	private handleCreateSessionError(session: ApiResponse<LabSession>) {
		if (!session.Successful) {
			this.state = "errorCreatingSession";
			this.errorSession = session
			this.createSession = <LabSession>session.Data;
			this.sessionMessage = session.ErrorMessages;
			this.createSessionError = true;
		}
		else {
			this.state = "loaded";
			this.createSession = <LabSession>session.Data;
			this.open2(this.singleSessionCreatedDialog);
		}
	}

	private createDateForSubmission(date: NgbDateStruct, time: NgbTimeStruct): string {
		return date.year + "-" + date.month + "-" + date.day + "T" +
			(time.hour + 0) + ":" + time.minute + ":" + time.second + "Z";
	}

	//create start and end dates from the information in the forms
	createStartEnd() {
		this.start_date;
		// this.fullStartDate = this.start_date.year + "-" + this.start_date.month + "-" + this.start_date.day + "T" + (this.start_time.hour + 4) + ":" +
		// 	this.start_time.minute + ":" + this.start_time.second + "Z";

		this.fullStartDate = this.createDateForSubmission(this.start_date, this.start_time);
		this.fullEndDate = this.createDateForSubmission(this.end_date, this.end_time);

		// this.fullEndDate = this.end_date.year + "-" + this.end_date.month + "-" + this.end_date.day + "T" + (this.end_time.hour + 4) + ":" +
		// 	this.end_time.minute + ":" + this.end_time.second + "Z";
	}

	//check to see if the end date is after the start date
	compareStartEnd() {
		//Converts the numbers to correctly formated strings and then changes them to numbers
		let startDate: string = "" + this.start_date.year + this.formatDigit(this.start_date.month) +
			this.formatDigit(this.start_date.day) + this.formatDigit(this.start_time.hour) +
			this.formatDigit(this.start_time.minute) + this.formatDigit(this.start_time.second);
		let sd: number = +startDate;
		let endDate: string = "" + this.end_date.year + this.formatDigit(this.end_date.month) +
			this.formatDigit(this.end_date.day) + this.formatDigit(this.end_time.hour) +
			this.formatDigit(this.end_time.minute) + this.formatDigit(this.end_time.second);
		let ed: number = +endDate;
		if (sd < ed) {
			this.startBeforeEnd = true;
		}
		else {
			this.startBeforeEnd = false;
		}
	}

	//Gives padding zeros as placeholders when converting date and time to number
	formatDigit(n: number): string {
		let s = n + "";
		while (s.length < 2) s = "0" + s;
		return s;
	}

	//copy the session token to the clipboard
	copySessionCode() {
		this.copied = true;
		let selBox = this.document.createElement('textarea');
		selBox.value = this.generatedCode;
		this.document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		this.document.execCommand('copy');
		this.document.body.removeChild(selBox);
	}
	//copy the session link to the clipboard
	copySessionLink() {
		this.copied = true;
		let selBox = this.document.createElement('textarea');
		let url = `${environment.server}/lab_sessions/${this.generatedId}`;
		selBox.value = url;
		this.document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		this.document.execCommand('copy');
		this.document.body.removeChild(selBox);
	}

	//open the create course modal
	open(content) {
		let modal = this.modalService.open(content, <NgbModalOptions>{ ariaLabelledBy: 'modal-create-course' }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
		console.log("Testing Modal");
		this.courseService.newCourse$.subscribe(
			course => this.modalService.dismissAll()
		);
	}

	//open the create new session modal
	//  REVIEW  - the name of this method isn't indicative of what it does
	open2(content2) {
		if (this.startBeforeEnd) {
			let modal = this.modalService.open(content2, <NgbModalOptions>{ ariaLabelledBy: 'modal-create-new-session' }).result.then((result) => {
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
		}
	}

	//set reason for dismissal of the modal
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
}
