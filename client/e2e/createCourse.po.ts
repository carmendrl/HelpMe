import { browser, by, element, Key } from 'protractor';

export class CreateCourse{
  navigateTo(){
      return browser.get('/login');
  }
  getEmailTextbox() {
    return element(by.name('Email'));
  }
  getPasswordTextbox() {
    return element(by.name('Password'));
  }

  getForm(){
      return element(by.css('.createCourseForm'));
  }

  getSubmitButton(){
      return element(by.css('.loginButton'));
  }

  navigateTo2(){
    return browser.get('/dashboard');
  }
  getStartSession(){
    return element(by.tagName('app-start-session'));
  }

  getCreateCourseButton(){
    return element(by.css('.createCourseButton'));
  }

  getOpenModalElement() {
    return element(by.tagName('app-create-course-form'));
  }

  getOpenModalFormElement() {
    return element(by.css('.createCourseForm'));
  }

  getPageTitle(){
    return browser.getTitle();
  }

  getTitleTextBox(){
    return element(by.name('Title'));
  }

  getSubjectTextBox(){
    return element(by.name('subject'));
  }

  getNumberTextBox(){
    return element(by.name('number'));
  }

  getYearTextBox(){
    return element(by.name('year'));
  }

  getSemester(){
    return element(by.css('.june'));
  }

  getSaveButton(){
    return element(by.css('.saveButton'));
  }

  getProfileMenuComponent(){
    return element(by.tagName('app-user-profile'));
  }

  getProfileMenu() {
    return element(by.css('.menu'));
  }

  getLogoutButton(){
    return element(by.css('.logout'));
  }

  getStartSessionComponent(){
    return element(by.tagName('app-start-session'))
  }
}
