import { browser, by, element, Key } from 'protractor';

export class StudentLogin{
  navigateTo(){
    return broswer.get('/dashboard');
  }
  getJoinSess(){
    return element(by.name('token'));
  }
  getSessionList(){
    return element(by.tagName('app-session-list'));
  }
}
