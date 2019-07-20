import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-create-course-form',
	templateUrl: './create-course-form.component.html',
	styleUrls: ['./create-course-form.component.scss'],
	providers: [DatePipe]
})
export class CreateCourseFormComponent implements OnInit, OnDestroy {
	private todayYear: number; //the current year
	subject: string; //subject of the course - ex:CSCI
	number: string; //number of the course
	title: string; //Full Title of the course
	semester: string; //number of semester as string - ex: 08
	saved: boolean = false; //is the course saved?

	constructor(private courseService: CourseService, private titleService: Title) {
		this.getYear();  //sets the placeholder of the year input to the current year
	}

	ngOnInit() {
		this.titleService.setTitle('Create a Course - Help Me');
	}

	ngOnDestroy() {
		this.titleService.setTitle('Dashboard - Help Me');
	}

	//crete a new course form the information in the form
	createNewCourseFromForm() {
		this.saved = true;
		let yearSemester = this.todayYear + this.semester; //concatenate the year and semester number
		this.courseService.postNewCourse(this.subject, this.number, this.title, yearSemester).subscribe();
	}

	//gets the current year and sets todayYear to it
	private getYear() {
		let date = new Date();
		this.todayYear = date.getFullYear();
	}
}
