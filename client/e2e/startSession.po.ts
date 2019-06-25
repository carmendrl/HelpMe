import { browser, by, element, Key} from 'protractor';

export class StartSession{
  navigateTo(){
    return browser.get('/dashboard');
  }

  getPageTitle(){
    return browser.getTitle();
  }

  getForm(){
    return element(by.css('.startSessionForm'));
  }

  getDescriptionTextBox(){
    return element(by.name('description'));
  }

  getStartDateTextBox(){
    return element(by.name('dp'));
  }

  getStartTimePicker(){
    return element(by.name('start_time'));
  }

  getEndDateTextBox(){
    return element(by.name('p'));
  }

  getEndTimePicker(){
    return element(by.name('end_time'));
  }

  getStartSessionButton(){
    return element(by.css('.startSessionButton'));
  }

  getCourseDropdown(){
    return element(by.name('selectedCourse'));
  // }
  // getCourseName(){
  //   return element(by.css())
  // }
}
