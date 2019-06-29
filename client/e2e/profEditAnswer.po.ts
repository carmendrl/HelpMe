import { browser, by, element, Key} from 'protractor';

export class ProfEditAnswer{
  navigateTo(){
    return browser.get('/login');
  }
  navigateTo2(){
    return browser.get('/dashboard');
  }
  navigateTo3(s:string){
    return browser.get('/lab_sessions/'+s);
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
  getPageTitle(){
    return browser.getTitle();
  }
  getFacultySessionView(){
    return element(by.tagName('app-faculty-session-view'));
  }
  getOtherQuestionComponent(){
    return this.getFacultySessionView().element(by.id('otherQs'));
  }
  getOtherQuestion(i:number){
    return this.getOtherQuestionComponent().all(by.id('questionRow')).get(i);
  }
  getMyQuestionComponent(){
    return this.getFacultySessionView().element(by.id('claimedQs'));
  }
  getMyQuestion(i:number){
    return this.getMyQuestionComponent().all(by.id('questionRow')).get(i);
  }
  getEditButton(e){
    return e.element(by.id('editButton'));
  }
  getFinishButton(e){
    return e.element(by.id('finishButton'));
  }
  getOpenModalElement() {
    return element(by.tagName('app-edit-modal'));
  }
  getOpenModalEditElement() {
    return element(by.id('modal-edit-answer'));
  }
  getCollapseButton(e){
    return e.element(by.id('collapseButton'));
  }
  getSaveButton(){
    return element(by.id('saveButton'));
  }
  getAnswerColumn(i:number){
    return this.getOtherQuestion(i).element(by.id('answerText')).element(by.id('text'));
  }
  getOpenModalElement2() {
    return element(by.tagName('app-answer-modal'));
  }
  getOpenAnswerModalElement() {
    return element(by.id('modal-create-answer'));
  }
  getAnswerButton(e){
    return e.element(by.id('answerButton'));
  }
  getSaveDraftButton(){
    return element(by.id('saveDraft'));
  }
  getTextEditor(){
    return element(by.css('.ql-editor'));
  }
}
