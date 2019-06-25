import { browser, by, element, Key } from 'protractor';

export class StudentMeToo{
  navigateTo(){
    return browser.get('/dashboard');
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
}
