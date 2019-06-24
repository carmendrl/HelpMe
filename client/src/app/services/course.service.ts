import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { of } from 'rxjs/observable/of';
import { map, tap, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { ApiResponse } from './api-response';
import { environment } from '../../environments/environment';

//start of CourseService class
@Injectable()
export class CourseService {
  private apiHost : string;
  public _newCourse$: Subject<Course>;

  constructor(private httpClient : HttpClient) {
    this.apiHost = environment.api_base;
    this._newCourse$ = new Subject<Course>();
  }

//returns a list of all the courses
  coursesList() : Observable<ApiResponse<Course[]>>{
    let url : string =`${this.apiHost}/courses`;
    var courses = new Array<Course>();
    return this.httpClient.get(url).pipe(
      map(r => {
        courses = this.createCoursesArray(r["data"], r["included"]);
        let response : ApiResponse<Course[]> = new ApiResponse<Course[]>(true, courses);
        return response;
      }),
      catchError(r => this.handleGetCourses(r, courses))
    );
  }

  private handleGetCourses(error: any, courses: Course[]): Observable<ApiResponse<Course[]>>{
    let apiResponse: ApiResponse<Course[]> = new ApiResponse<Course[]>(false);
    apiResponse.Data = courses;
    if(error instanceof HttpErrorResponse){
      apiResponse.addErrorsFromHttpError(error);
    }
    else{
      apiResponse.addError("An unknown error occured");
    }
    return of(apiResponse);
  }

  private createCoursesArray(objects : Object[], i: any[]) : Course[]{
    let courses = new Array <Course>();
    for(let object of objects){
      var professor : Object = i.find(function(element){
        return element["type"]==="professors" && element["id"]=== object["relationships"]["instructor"]["data"]["id"]})

        courses.push(this.buildCreateCourse(object, professor));
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

    private buildCreateCourse(o : Object, i: Object) : Course{
      let course = Course.createFromJSon(o);
      let prof = User.createFromJSon(i);

      course.professor = prof;

      return course;
    }

    createNewCourse(o : Object, i: Object): Course{
      let newCourse = Course.createFromJSon(o);
      let prof = User.createFromJSon(i[0]);

      newCourse.professor = prof;
      this._newCourse$.next(newCourse);

      return newCourse;
    }

    //returns the course
    postNewCourse(subject : string, num : string, title : string, semester : string) : Observable<ApiResponse<Course>> {
      let url : string=`${this.apiHost}/courses`;
      var course: Course;
      let body= {
        title: title,
        subject: subject,
        number: num,
        semester: semester
      };
      return this.httpClient.post(url, body).pipe(
        map(r => {
          course = this.createNewCourse(r["data"], r["included"]);
          let response : ApiResponse<Course> = new ApiResponse<Course>(true, course);
          return response;
        }),
        catchError(r => this.handleNewCourseError(r, course))
      );
    }

    private handleNewCourseError(error: any, course: Course): Observable<ApiResponse<Course>>{
      let apiResponse: ApiResponse<Course> = new ApiResponse<Course>(false);
      apiResponse.Data = course;
      if(error instanceof HttpErrorResponse){
        apiResponse.addErrorsFromHttpError(error);
      }
      else{
        apiResponse.addError("Unknown error occured");
      }
      return of(apiResponse);
    }

    get newCourse$() : Observable<Course>{
      return this._newCourse$;
    }


  
  }
