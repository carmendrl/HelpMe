import { browser, by, element, Key} from 'protractor';

export class ProfessorSwitchViews{
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
  navigateTo2(){
    browser.get('./dashboard');
  }
  getPageTitle(){
    return browser.getTitle();
  }
  getProfileMenuComponent(){
    return element(by.tagName('app-user-profile'));
  }
  getProfileMenu(){
    return element(by.css('.menu'));
  }
  getSwitchButton(){
    return element(by.css('.switchToStudent'));
  }
  getJoinSessionTextBox(){
    return element(by.name('token'));
  }
  getjoinSessionButton(){
    return element(by.css('.joinSessionButton'));
  }
  getSwitchButton2(){
    return element(by.css('.switchToProf'));
  }
  getActionDropdown(){
    return element(by.id('actions'));
  }
  getBackButton(){
    return element(by.id('back'));
  }
  getCurrentUrl(){
    return browser.getCurrentUrl();
  }
  getLogoutButton(){
    return element(by.css('.logout'));
  }
}
