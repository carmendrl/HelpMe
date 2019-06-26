import { browser, by, element } from 'protractor';
export class ProfQuestionFunctionsPage {
    navigateTo(){
        return browser.get('/login');
    }

    navigateToLab1(){
        return browser.get('/lab_sessions/16614b98-a4fc-4390-95f9-ae0a80cfedaf');
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

    getPageTitle(){
      return browser.getTitle();
    }

    getCurrentUrl(){
      return browser.getCurrentUrl();
    }

    getSessionList(){
      return element(by.tagName('app-session-list'));
    }

    getTableRowForSession(i:number){
      return this.getSessionList().all(by.id('tableRow')).get(i);
    }

    getViewButtonForSession(e){
      return e.element(by.id('viewButton'));
    }

    getFacultySessionView(){
      return element(by.tagName('app-faculty-session-view'));
    }

    getUnclaimedQuestionComponent(){
      return this.getFacultySessionView().element(by.id('unclaimedQs'));
    }

    getMyQuestionComponent(){
      return this.getFacultySessionView().element(by.id('claimedQs'));
    }

    getFaqComponent(){
      return this.getFacultySessionView().element(by.id('faqs'));
    }

    getOtherQuestionComponent(){
      return this.getFacultySessionView().element(by.id('otherQs'));
    }


//parameter i refers to index of question in the array
    getUnclaimedQuestions(){
      return this.getUnclaimedQuestionComponent().all(by.id('questionRow'));
    }

    getUnclaimedQuestion(i:number){
      return this.getUnclaimedQuestionComponent().all(by.id('questionRow')).get(i);
    }

   getLengthOfUnclaimedQs(){
     return this.getUnclaimedQuestionComponent().all(by.id('questionRow')).count();
   }

   getMyQuestions(){
     return this.getMyQuestionComponent().all(by.id('questionRow'));
   }

    getMyQuestion(i:number){
      return this.getMyQuestionComponent().all(by.id('questionRow')).get(i);
    }

   getLengthOfMyQs(){
     return this.getMyQuestionComponent().all(by.id('questionRow')).count();
   }

   getFaqQuestions(){
     return this.getFaqComponent().all(by.id('questionRow'));
   }

    getFaqQuestion(i:number){
      return this.getFaqComponent().all(by.id('questionRow')).get(i);
    }

    getLengthOfFaq(){
      return this.getFaqComponent().all(by.id('questionRow')).count();
    }

    getOtherQuestions(){
      return this.getOtherQuestionComponent().all(by.id('questionRow'));
    }

    getOtherQuestion(i:number){
      return this.getOtherQuestionComponent().all(by.id('questionRow')).get(i);
    }

    getLengthOfOther(){
      return this.getOtherQuestionComponent().all(by.id('questionRow')).count();
    }

//e is the row of a single question (the result of one of the previous 4 methods)
    getCollapseButton(e){
      return e.element(by.id('collapseButton'));
    }

    getClaimButton(e){
      return e.element(by.id('claimButton'));
    }

    getUnclaimButton(e){
      return e.element(by.id('unclaimButton'));
    }

    getAssignButton(e){
      return e.element(by.id('assignButton'));

    }

    getDeleteButton(e){
      return e.element(by.id('deleteButton'));
    }

    getAddFaqButton(e){
      return e.element(by.id('addFaqButton'));
    }

    getRemoveFaqButton(e){
      return e.element(by.id('removeFaqButton'));
    }

    getElementValue(e){
      //return string if the element has "value" attribute
      //otherwise returns null
      return e.getAttribute('value');
    }

    getElementValueArray(e){
      var array= new Array<any>();
      e.each(function(e){e.getAttribute('value').then(function(text){
        array.push(text);
      });
    });
      return array;
    }

    slowDown(){
      browser.sleep(2000)
    }



}
