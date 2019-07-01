import { browser, by, element, Key} from 'protractor';

export class StartSession{
  getEmailTextbox() {
    return element(by.name('Email'));
  }
  getPasswordTextbox() {
    return element(by.name('Password'));
  }
  getSubmitButton(){
    return element(by.css('.loginButton'));
  }
  navigateTo(){
    return browser.get('/dashboard');
  }

  getPageTitle(){
    return browser.getTitle();
  }

  getStartSessionComponent(){
    return element(by.tagName('app-start-session'));
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

  getStartTimePickerHour(){
    return element(by.name('start_time')).element(by.css('.ngb-tp-hour')).element(by.tagName('input'));
  }

  getStartTimePickerMinute(){
    return element(by.name('start_time')).element(by.css('.ngb-tp-minute')).element(by.tagName('input'));
  }

  getEndDateTextBox(){
    return element(by.name('p'));
  }

  getEndTimePickerHour(){
    return element(by.name('end_time')).element(by.css('.ngb-tp-hour')).element(by.tagName('input'));
  }

  getEndTimePickerMinute(){
    return element(by.name('end_time')).element(by.css('.ngb-tp-minute')).element(by.tagName('input'));
  }

  getPMButton(){
    return element(by.name('end_time')).element(by.css('.btn-outline-primary'));
  }

  getStartSessionButton(){
    return element(by.css('.startSessionButton'));
  }

  getCourseDropdown(){
    return element(by.css('.selectACourse'));
 }
  selectACourse(){
    return element(by.name('selectedCourse'));
  }
  select(){
    return this.selectACourse().sendKeys('t');
  }
  getProfileMenuComponent(){
    return element(by.tagName('app-user-profile'));
  }
  getProfileMenu(){
    return element(by.css('.menu'));
  }
  getLogoutButton(){
    return element(by.css('.logout'));
  }
}
