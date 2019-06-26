import { browser, by, element, Key } from 'protractor';

export class TaViewTests{
  navigateTo(){
    browser.get('/login');
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
  getFacultyDashboard(){
    return element(by.tagName('app-faculty-dashboard'));
  }
  getStudentDashboard(){
    return element(by.tagName('app-student-dashboard'));
  }
  getJoinBox(){
    return element(by.name('join'));
  }
  getProfileMenuComponent(){
    return element(by.tagName('app-user-profile'));
  }

  getProfileMenu() {
    return this.getProfileMenuComponent().element(by.css('.menu'));
  }
  getSwitchButton(){
    return this.getProfileMenu().element(by.name('taSwitch'));
  }
  getSwitchBackButton(){
    this.getProfileMenu().click();
    return element(by.name('taSwitchBack'));
  }

  getLogoutButton(){
    return element(by.css('.logout'));
  }
}
