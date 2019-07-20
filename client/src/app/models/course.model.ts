import { User } from './user.model';
import { Entity } from './entity.model';

export class Course extends Entity {
	constructor(private _subject?: string, private _number?: string, private _title?: string, private _semester?: string, private _professor?: User, _id?: string) {
		super(_id);
	}

	get subject(): string {
		return this._subject;
	}

	set subject(subject: string) {
		this._subject = subject;
	}

	get number(): string {
		return this._number;
	}

	set number(number: string) {
		this._number = number;
	}

	get title(): string {
		return this._title;
	}

	set title(title: string) {
		this._title = title;
	}

	//ex: 08
	get semester(): string {
		return this._semester;
	}

	set semester(semester: string) {
		this._semester = semester;
	}

	//return the name of the semester ex: July 2019
	get friendlySemester(): string {
		let year = this._semester.substr(0, 4);
		let month = +(this._semester.substr(4, 6));
		switch (month) {
			case 8:
				return `Fall ${year}`;
			case 1:
				return `Spring ${year}`;
			case 5:
				return `May ${year}`;
			case 6:
				return `June ${year}`;
			case 7:
				return `July ${year}`;
		}

	}

	get professor(): User {
		return this._professor;
	}

	set professor(professor: User) {
		this._professor = professor;
	}

	get subjectAndNumber(): string {
		return `${this.subject} ${this.number}`;
	}

	//creates a new course given a josn response
	static createFromJSon(o: Object) {
		let course = new Course();

		course.id = o["id"];
		course.title = o["attributes"]["title"];
		course.subject = o["attributes"]["subject"];
		course.number = o["attributes"]["number"];
		course.semester = o["attributes"]["semester"];

		return course;
	}

}
