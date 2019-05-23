import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { API_SERVER } from '../app.config';

import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { ModelFactoryService } from './model-factory.service';
import { of } from 'rxjs/observable/of';
import { map, tap, catchError } from 'rxjs/operators';


class CourseResponse{
    constructor (private data: CourseResponseData){}
    get Id(): string {return this.data.id}
    get Type(): string {return this.data.type}
    get Title(): string {return this.data.attributes["title"]}
    get Subject():string {return this.data.attributes["subject"]}
    get Number(): string {return this.data.attributes["number"]}
    get Semester(): string {return this.data.attributes["semester"]}
    get ReId() : string {return this.data.relationships.instructor["id"]}
    get ReType() :string {return this.data.relationships.instructor["type"]}
  }

  class CourseResponseData{
    public id : string;
    public type : string;
    public attributes : CourseResponseAttributes;
    public relationships : CourseResponseRelationshipInstructor;
  }

  class CourseResponseAttributes {
    public title : string;
    public subject : string;
    public number : string;
    public semester : string;
  }

  class CourseResponseRelationshipInstructor{
    public instructor: CourseResponseRelationshipInstructorData;
  }

  // class CourseResponseRelationshipInstructorData{
  //   public data: CourseResponseRelationshipInstructorDataDetails;
  // }

  class CourseResponseRelationshipInstructorData{
    public id:  string;
    public type: string;
  }

  class IncludedProfessorResponse{
    constructor (private data: IncludedProfessorResponseData){
    }
    get Id() : string { return this.data.id }
    get Type() : string { return this.data.type }
    get Email() : string { return this.data.attributes["email"]}
    get Username() : string {return this.data.attributes["username"]}
    get Role() : string {return this.data.attributes["role"]}
    get FirstName() : string {return this.data.attributes["first-name"]}
    get LastName() : string {return this.data.attributes["last-name"]}

  }

  class IncludedProfessorResponseData{
    public id : string;
    public type : string;
    public attributes: IncludedProfessorAttributes;
  }

  class IncludedProfessorAttributes{
    public email: string;
    public username: string;
    public role: string;
    public firstNmae: string;
    public lastName: string;
  }

  @Injectable()
  export class CourseService {
    private apiHost : string;

  constructor(private httpClient : HttpClient, private _modelFactory : ModelFactoryService, @Inject(API_SERVER) host : string) {
            this.apiHost = host;
  }


  coursesList() : Observable<Course[]>{
    let url : string =`${this.apiHost}/courses`;
    return this.httpClient.get(url).pipe(map(r => this.createCoursesArray(r["data"]))
    );
  }


  private createCoursesArray(courseData : CourseResponseData[]) : Course[]{
    let courses = new Array <Course>();

    for(let data of courseData){
      courses.push(this.buildCreateCourse(data));
    }
    return courses;
  }


  private buildCreateCourse(b : CourseResponseData, a: IncludedProfessorResponseData) : Course{
    let c = new CourseResponse(b);
    let p = new IncludedProfessorResponse9a);

    let professor = new User(p.Email, p.Username, p.FirstName, p.LastName, p.Type, p.Id);
    let course = new Course(c.Subject, c.Number, c.Title, c.Semester, professor);

    return course;
  }


  private handleCreateAccountError (error) : Observable<boolean> {
    if (error instanceof HttpErrorResponse) {
      let httpError = <HttpErrorResponse> error;
      let errorMessage : string = "The account was not created for the following reasons:";
      let reasons = error.error.errors.full_messages.join(", ");
      console.log(reasons);
    }
    return of(false);
  }


}
