import { browser, by, element, Key } from 'protractor';

export class TaCreateSession{
  navigateTo(){
    browser.get('/login');
  }
  navigateTo2(){
    browser.get('/dashboard');
  }
  getEmailTextbox() {
    return element(by.name('Email'));
  }
  getPasswordTextbox() {
    return element(by.name('Password'));
  }
  getSubmitButton(){
      return element(by.css('.loginButton'));
  }
  getProfileMenuComponent(){
    return element(by.tagName('app-user-profile'));
  }
  getSessionsLength(){
    this.getSessionList();
    return this.getSessionList().all(by.id('tableRow')).count();
  }
  getProfileMenu() {
    return this.getProfileMenuComponent().element(by.css('.menu'));
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
    return element(by.name('end_date'));
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
  setUpSession(){
    this.getStartSessionComponent();
    this.getForm();
    this.getDescriptionTextBox().sendKeys('test session');
    this.getStartDateTextBox().sendKeys('2019-06-27');
    this.getStartTimePickerHour().sendKeys('10');
    this.getStartTimePickerMinute().sendKeys('00');
    this.getEndDateTextBox().sendKeys('2019-06-27');
    this.getEndTimePickerHour().sendKeys('05');
    this.getEndTimePickerMinute().sendKeys('30');
    this.getPMButton().click();
  }
  startSession(){
    return element(by.name('start'));
  }
  getSwitchButton(){
    return this.getProfileMenu().element(by.name('taSwitch'));
  }
  getSwitchBackButton(){
    return this.getProfileMenu().element(by.name('taSwitchBack'));
  }

  getSessionList(){
    return element(by.tagName('app-session-list'));
  }
  getLogoutButton(){
    return element(by.css('.logout'));
  }

}
