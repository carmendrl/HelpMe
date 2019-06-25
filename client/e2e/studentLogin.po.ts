import { browser, by, element, Key } from 'protractor';

export class StudentLogin{

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
      return element(by.css('.loginForm'));
  }

  getSubmitButton(){
      return element(by.css('.loginButton'));
  }

  getJoinSess(){
    return element(by.name('token'));
  }
  getSessionList(){
    return element(by.tagName('app-session-list'));
  }

  getUserProfile(){
    return element(by.tagName('app-user-profile'));
  }

  getLogOut(){
    return element(by.name('logOut'));
  }

  getPageTitle(){
    return browser.getTitle();
  }
}
