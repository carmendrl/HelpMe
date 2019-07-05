import { browser, by, element, Key } from 'protractor';

export class StudentQuestions{
  navigateTo(){
    return browser.get('/login');
  }
  navigateTo2(){
    return browser.get('/dashboard');
  }
  getEmailTextbox() {
    return element(by.name('Email'));
  }
  getPasswordTextbox() {
    return element(by.name('Password'));
  }

  getForm(){
      return element(by.css('.createCourseForm'));
  }

  getSubmitButton(){
      return element(by.css('.loginButton'));
  }
  getMyQuestionsList(){
    return element(by.name('myQs'));
  }
  getSessionList(){
    return element(by.tagName('app-session-list'));
  }
  getSession(){
    return element(by.css('sessionList'));
  }
  getViewButton(){
    return element(by.name('view'));
  }
  getMyOpen(){
    return this.getMyQuestionsList().element(by.name('open'));
  }
  getQuestion(i){
    return this.getOtherQuestionsList().all(by.id('questionRow')).get(i)
  }
  getAnswerButton(){
    return element(by.name('answer'));
  }
  getOtherQuestionsList(){
    return element(by.name('otherQs'));
  }
  // getAskQuestionSection(){
  //   return element(by.css('askQuestion'));
  // }
  setUpAnswer(){
    return element(by.tagName('app-answer-model'));
  }
  getSaveButton(){
    return element(by.id('save'));
  }
  getAnswerText(){
    return element(by.model('answer.text'));
  }
  getAskQuestion(){
    return element(by.tagName('app-ask-question'));
  }
  getAskQuestionButton(){
    return element(by.name('askQuestionButton'));
  }
  getModalBody(){
    return element(by.css('modal-body'));
  }
  getStudentSessionView(){
    return element(by.tagName('app-student-session-view'));
  }
  getStep(){
    return element(by.name('step'));
  }
  getEditor(){
    return element(by.model('questionMessage'));
  }
  getSubmitQuestion(){
    return element(by.name('submitQuestion'));
  }
  getQuestionList(){
    return element(by.tagName('app-question-list'));
  }
  getResults(){
    return element(by.css('results'));
  }
  getQuestionText(){
    return element(by.name('questionText'));
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
