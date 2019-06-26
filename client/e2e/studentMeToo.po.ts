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

  getSubmitButton(){
      return element(by.css('.loginButton'));
  }
  getSessionList(){
    return element(by.tagName('app-session-list'));
  }
  getViewButton(){
    return this.getSessionList().element(by.name('view'));
  }
  getOtherQuestionsList(){
    return element(by.name('otherQs'));
  }
  getOtherOpen(){
    return this.getOtherQuestionsList().element(by.name('open'));
  }
  getQuestion(i){
    return this.getOtherQuestionsList().all(by.id('questionRow')).get(i)
  }
  getMeTooButton(i){
    return element(by.name('meToo'));
  }
  getMyQuestionsList(){
    this.navigateTo();
    this.getViewButton().click();
    return element(by.name('myQs'));
  }
  getMyQslength(){
    return this.getMyQuestionsList().all(by.id('questionRow')).count();
  }
  getOtherQslength(){
    return this.getOtherQuestionsList().all(by.id('questionRow')).count();
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
