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
  getStudentDashboard(){
    return element(by.tagName('app-student-dashboard'));
  }
  getTextBox(){
    return element(by.name('token'));
  }
  getJoinButton(){
    return element(by.name('join'));
  }
  getJoinForm(){
    return element(by.name('joinSessForm'));
  }
  getModal(){
    return element(by.name('sessionNotStarted'));
  }
  getAlert(){
    return element(by.css('alert'));
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

  getSessionListComponent(){
    return element(by.tagName('app-session-list'));
  }

  // getSessionList(){
  //   return this.getSessionListComponent().element(by.id('tableRow'));
  // }

  getSessionListLength(){
    return this.getSessionListComponent().all(by.id('tableRow')).count();
  }
}
