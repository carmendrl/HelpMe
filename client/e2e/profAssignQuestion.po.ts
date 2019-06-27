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
  getSessionListComponent(){
    return element(by.tagName('app-session-list'));
  }
  getTableRowForSession(i:number){
    return this.getSessionListComponent().all(by.id('tableRow')).get(i);
  }
  getViewButtonForSession(e){
    return e.element(by.id('viewButton'));
  }
  getCurrentUrl(){
    return browser.getCurrentUrl();
  }
  getFacultySessionView(){
    return element(by.tagName('app-faculty-session-view'));
  }
  getCollapseButton(e){
    return e.element(by.id('collapseButton'));
  }
  getUnclaimedQuestionList(){
    return this.getFacultySessionView().element(by.id('unclaimedQs'));
  }
  getUnclaimedQuestion(i:number){
    return this.getUnclaimedQuestionList().all(by.id('questionRow')).get(i);
  }
  getLengthOfUnclaimedQs(){
    return this.getUnclaimedQuestionList().all(by.id('questionRow')).count();
  }
  getClaimedQuestionsList(){
    return this.getFacultySessionView().element(by.id('claimedQs'));
  }
  getClaimedQuestion(i:number){
    return this.getClaimedQuestionsList().all(by.id('questionRow')).get(i);
  }
  getLengthOfClaimedQs(){
    return this.getClaimedQuestionsList().all(by.id('questionRow')).count();
  }
  getOtherQuestionList(){
    return this.getFacultySessionView().element(by.id('otherQs'));
  }
  getOtherQuestion(i:number){
    return this.getOtherQuestionList().all(by.id('questionRow')).get(i);
  }
  getLengthOfOtherQs(){
    return this.getOtherQuestionList().all(by.id('questionRow')).count();
  }
  //ql-editor
  getAssignButton(e){
    return e.element(by.id('assignButton'));
  }
  getAssignModal(){
    return element(by.tagName('app-assign-modal'));
  }
  getOpenAssignModal(){
    return this.getAssignModal().element(by.id('modal-assign'));
  }
  navigateTo2(s:string){
    return browser.get('/lab_sessions/'+s);
  }
  getSaveAssignButton(){
    return element(by.id('save'));
  }
}
