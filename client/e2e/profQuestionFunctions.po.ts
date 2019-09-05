import { browser, by, element } from 'protractor';
export class ProfQuestionFunctionsPage {
  navigateTo(){
    return browser.get('/login');
  }

  navigateToLab1(){
    return browser.get('/lab_sessions/d82fabc9-0976-4f6f-8bb1-b8ec9f16a395');
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

  getComponentOfUnclaimedComponent(e){
    return this.getUnclaimedQuestionComponent().element(by.id(e));
  }

  getMyQuestionComponent(){
    return this.getFacultySessionView().element(by.id('claimedQs'));
  }

  getComponentOfMyComponent(e){
    return this.getMyQuestionComponent().element(by.id(e));
  }

  getFaqComponent(){
    return this.getFacultySessionView().element(by.id('faqs'));
  }

  getComponentOfFaqComponent(e){
    return this.getFaqComponent().element(by.id(e));
  }

  getOtherQuestionComponent(){
    return this.getFacultySessionView().element(by.id('otherQs'));
  }

  getComponentOfOtherComponent(e){
    return this.getOtherQuestionComponent().element(by.id(e));
  }


  //parameter i refers to index of question (really of the action blocks) in the array

  //get array of <tr> question elements
  getQuestionElementArray(e){
    //e is full questionlist component
    //returns an array of <tr> question elements
    return e.all(by.className('questionRow'));
  }

  getQuestionElement(e, i:number){
    //e is an array of <tr> question elements
    //returns single Question <tr> element
    return e.get(i);
  }

  getQuestionId(e){
    //e is a a single <tr> question element
    //returns single Question string id
    return e.getAttribute('id');
  }

  getQuestionIdArray(e){
    //e is an array of <tr> question elements
    //returns an array of id string (one for each element)
  var array= new Array<any>();
  e.each(function(element)
    {element.getAttribute('id').then(function(text)
    {array.push(text);})
  });
  return array;
}

getElementArrayLength(e){
  //e is an array of <tr> question elements
  return e.count();
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

slowDown(){
  browser.sleep(7000)
}



}
