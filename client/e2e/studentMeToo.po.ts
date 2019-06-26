import { browser, by, element, Key } from 'protractor';

export class StudentMeToo{
  navigateTo(){
    return browser.get('/dashboard');
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
  getSessionList(){
    return element(by.tagName('app-session-list'));
  }
  getSession(){
    return element(by.css('sessionList'));
  }
  getViewButton(){
    return element(by.name('view'));
  }
  getAllQuestionsList(){
    return element(by.name('otherQs'));
  }
  getMeTooButton(){
    return element(by.name('meToo'));
  }
  getMyQuestionsList(){
    return element(by.name('myQs'));
  }
  getQuestion(){
    return element(by.name('questions')).all(by.model('questionText'));
  }
  getStudentSessionView(){
    return element(by.tagName('app-student-session-view'));
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
  getTable(){
    return element(by.css('table'));
  }
  getButtons(){
    return element(by.name('buttons'));
  }
  getOpenButton(){
    return element(by.name('open'));
  }
  getQuestionListHeader(){
    return element(by.name('questionListHeader'));
  }
}
