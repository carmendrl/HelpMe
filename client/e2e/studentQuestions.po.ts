import { browser, by, element, Key } from 'protractor';

export class StudentQuestions{
  navigateTo(){
    return browser.get('/login');
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

  getSessionList(){
    return element(by.tagName('app-session-list'));
  }
  getSession(){
    return element(by.css('sessionList'));
  }
  getViewButton(){
    return element(by.name('view'));
  }
  // getAskQuestionSection(){
  //   return element(by.css('askQuestion'));
  // }
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
}
