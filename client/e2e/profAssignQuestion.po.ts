import { browser, by, element, Key} from 'protractor';

export class ProfAssignQuestion{
  navigateTo(){
    return browser.get('/login');
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
  getPageTitle(){
    return browser.getTitle();
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

}
