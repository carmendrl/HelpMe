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
import { Subject } from 'rxjs/Subject';


class CourseResponse{
    constructor (private data: CourseResponseData){}
    get Id(): number {return this.data.id}
    get Type(): string {return this.data.type}
    get Title(): string {return this.data.attributes["title"]}
    get Subject():string {return this.data.attributes["subject"]}
    get Number(): string {return this.data.attributes["number"]}
    get Semester(): string {return this.data.attributes["semester"]}
    get ReId() : number {return this.data.relationships.instructor.data["id"]}
    get ReType() :string {return this.data.relationships.instructor.data["type"]}
  }

  class CourseResponseData{
    public id : number;
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

  class CourseResponseRelationshipInstructorData{
    public data: CourseResponseRelationshipInstructorDataDetails;
  }

  class CourseResponseRelationshipInstructorDataDetails{
    public id:  number;
    public type: string;
  }


  class IncludedProfessorResponse{
    constructor (private data: IncludedProfessorResponseData){
    }
    get Id() : number { return this.data.id }
    get Type() : string { return this.data.type }
    get Email() : string { return this.data.attributes["email"]}
    get Username() : string {return this.data.attributes["username"]}
    get Role() : string {return this.data.attributes["role"]}
    get FirstName() : string {return this.data.attributes["first-name"]}
    get LastName() : string {return this.data.attributes["last-name"]}

  }

  class IncludedProfessorResponseData{
    public id : number;
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

  // class professorResponse{
  //   constructor(private data : professorResponseData){
  //   }
  //
  //   get Id(): number {return this.data.id}
  //   get Type(): string {return this.data.type}
  //   get Email(): string {return this.data.attributes["email"]}
  //   get Username(): string {return this.data.attributes["username"]}
  //   get Role(): string {return this.data.attributes["role"]}
  //   get FirstName(): string {return this.data.attributes["first_name"]}
  //   get LastName(): string {return this.data.attributes["last_name"]}
  // }
  //
  // class professorResponseData{
  //   public id: string;
  //   public type: string;
  //   public attributes: professorResponseAttributes;
  // }
  //
  // class professorResponseAttributes{
  //   public email: string;
  //   public username: string;
  //   public role: string;
  //   public first_name: string;
  //   public last_name: string;
  // }


  @Injectable()
  export class CourseService {
    private apiHost : string;
    public _newCourse$: Subject<Course>;

  constructor(private httpClient : HttpClient, private _modelFactory : ModelFactoryService, @Inject(API_SERVER) host : string) {
            this.apiHost = host;
            this._newCourse$ = new Subject<Course>();
  }


  coursesList() : Observable<Course[]>{

    let url : string =`${this.apiHost}/courses`;

    return this.httpClient.get(url).pipe(
      map(r => this.createCoursesArray(r["data"], r["included"]))
    );

  }


  private createCoursesArray(courseDatas : CourseResponseData[], includedResponse : any[]) : Course[]{
    let courses = new Array <Course>();
    for(let courseData of courseDatas){
    var professor : IncludedProfessorResponseData = includedResponse.find(function(element){
        return element["type"]==="professors" && element["id"]=== courseData.relationships.instructor.data["id"]})

      courses.push(this.buildCreateCourse(courseData, professor));
    }
    courses= courses.sort(function(a, b){
      if(a.subject > b.subject){
        return 1;
      }
      else if(a.subject === b.subject){
        if(a.number > b.number){
          return 1;
        }
        else{
          return -1;
        }
      }
      else{
        return -1;
      }
    });
    return courses;
  }


  private buildCreateCourse(b : CourseResponseData, a: IncludedProfessorResponseData) : Course{
    let c = new CourseResponse(b);
    let p = new IncludedProfessorResponse(a);

    let professor = new User(p.Email, p.Username, p.FirstName, p.LastName, p.Type, p.Id);
    let course = new Course(c.Subject, c.Number, c.Title, c.Semester, professor, c.Id);

    return course;
  }



  createNewCourse(d : CourseResponseData, i : IncludedProfessorResponseData): Course{ //add i:IncludedProfessorResponseData
     debugger
     let c = new CourseResponse(d);

     let newCourse = new Course(c.Subject, c.Number, c.Title, c.Semester, new User(), c.Id);
     debugger
     let p = new IncludedProfessorResponse(i[0]);

     let user = new User(p.Email, p.Username, p.FirstName, p.LastName, p.Type, p.Id);
     let newCourse = new Course(c.Subject, c.Number, c.Title, c.Semester, user, c.Id);
     debugger
    this._newCourse$.next(newCourse);

     return newCourse;
   }

 //returns the course
    postNewCourse(subject : string, num : string, title : string, semester : string) : Observable<Course> {
     debugger
     let url : string=`${this.apiHost}/courses`;
     let body= {
       title: title,
       subject: subject,
       number: num,
       semester: semester
     };
     return this.httpClient.post(url, body).pipe(
       map(r => this.createNewCourse(r["data"], r["included"])),
       catchError(this.handleError<Course>(`post new course`))
     );
   }

   get newCourse$() : Observable<Course>{
     return this._newCourse$;
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

      private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead


      // Let the app keep running by returning an empty result.
      return of(result as T);
    };

}
}
