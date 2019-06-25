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
      return element(by.css('.loginForm'));
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
    return element(by.name('title'));
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
    return element(by.css)
  }

  getSaveButton(){
    return element(by.css('.saveButton'))
  }
}
