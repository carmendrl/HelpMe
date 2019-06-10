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
    return element(by.css('app-start-session .createCourseButton'));
  }

  getOpenModalElement() {
    return element(by.tagName('app-create-course-form'));
  }

  getOpenModalFormElement() {
    return element(by.css('.createCourseForm'));
  }

}
