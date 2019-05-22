import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LabSession } from '../models/lab_session.model';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { of } from 'rxjs/observable/of';


class CourseResponse{
  constructor (private data: CourseResponseData){
  }
get Id(): number {return this.data.id}
get Type(): string {return this.data.type}
get Title(): string {return this.data.attributes["title"]}
get Subject():string {return this.data.attributes["subject"]}
get Number(): string {return this.data.attributes["number"]}
get Semester(): string {return this.data.attributes["semester"]}
get ReId() : number {return this.data.relationships.instructor["id"]}
get ReType() :string {return this.data.relationships.instructor["type"]}

}

class CourseResponseData{
  public id : number;
  public type : string;
  public attributes : CourseResponseAttributes;
  public relationships : CourseResponseRelationshipInstructor;
}
class CourseResponseAttributes {
  public title : string;
  public subject: string;
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
public id:  number;
public type: string;
}



@Injectable()
export class CourseService {

  constructor() { }

}
