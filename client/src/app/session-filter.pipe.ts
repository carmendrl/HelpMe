import { Pipe, PipeTransform } from '@angular/core';
import { LabSession } from './models/lab_session.model';
@Pipe({
  name: 'sessionfilter'
})
export class SessionFilterPipe implements PipeTransform {
  transform(sessions : LabSession[], searchText: string): LabSession[] {
    if(!sessions || !searchText){
      return sessions;
    }
    return sessions.filter( session =>{
      let courseName = session.course.subjectAndNumber.toLowerCase().indexOf(searchText.toLowerCase())!== -1;
      if(courseName){
        return courseName;
      }
      let prof = session.course.professor.FullName.toLowerCase().indexOf(searchText.toLowerCase())!== -1;
      if(prof){
        return prof;
      }
      let description = session.description.toLowerCase().indexOf(searchText.toLowerCase())!== -1;
      if(description){
        return description;
      }
    })
   }
}
