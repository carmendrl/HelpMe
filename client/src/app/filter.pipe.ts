import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(questions: Question[], searchText: string): Question[] {
    if(!questions || !searchText){
      return questions;
    }
//searchText = searchText.toLowerCase();
return questions.filter( question =>
  question.text.toLowerCase().indexOf(searchText.toLowerCase())!== -1);
    
   }
}
