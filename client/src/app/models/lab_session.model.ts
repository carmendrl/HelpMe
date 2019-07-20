import { Course } from './course.model';
import { User } from './user.model';
import { Entity } from './entity.model';

export class LabSession extends Entity {
	constructor(private _description?: string, private _startDate?: Date, private _endDate?: Date, private _course?: Course, _id?: string, private _token?: string, private _members?: User[]) {
		super(_id);
	}

	get description(): string { return this._description; }
	set description(description: string) {
		this._description = description;
	}

	get startDate(): Date { return this._startDate; }
	set startDate(startDate: Date) {
		this._startDate = startDate;
	}

	get endDate(): Date { return this._endDate; }
	set endDate(endDate: Date) {
		this._endDate = endDate;
	}

	get course(): Course { return this._course }
	set course(theCourse: Course) {
		this._course = theCourse;
	}

	get professor(): User { return this._course.professor }

	get token(): string { return this._token; }
	set token(token: string) {
		this._token = token;
	}

	get members(): User[] {
		return this._members;
	}

	set members(members: User[]) {
		this._members = members;
	}

	//creates a new labsession when given a josn response
	static createFromJSon(o: Object): LabSession {
		let session = new LabSession();
		session.id = o["id"];
		session.description = o["attributes"]["description"];
		session.startDate = o["attributes"]["start_date"];
		session.endDate = o["attributes"]["end_date"];
		session.token = o["attributes"]["token"];
		//session.members =
		return session;
	}
}
