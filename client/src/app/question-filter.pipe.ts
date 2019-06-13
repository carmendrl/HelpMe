import { Pipe, PipeTransform } from '@angular/core';
import { Question } from './models/question.model';
@Pipe({
  name: 'questionfilter'
})
export class QuestionFilterPipe implements PipeTransform {
  transform(questions: Question[], searchText: string): Question[] {
    if(!questions || !searchText){
      return questions;
    }
    return questions.filter( question => question.text.toLowerCase().indexOf(searchText.toLowerCase())!== -1)
  }
}
