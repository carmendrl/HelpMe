import { browser, by, element, Key } from 'protractor';

export class JoinSession{
  navigateTo(){
    return browser.get('/login');
  }
  getEmailTextbox(){
    return element(by.name('Email'));
  }
  getPasswordTextbox(){
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
  getTextBox(){
    return element(by.name('token'));
  }
  getJoinButton(){
    return element(by.name('join'));
  }

  getPageTitle(){
    return browser.getTitle();
  }
}
