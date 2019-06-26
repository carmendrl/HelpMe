import { StudentQuestions } from './studentQuestions.po';
import { browser } from 'protractor';

xdescribe('test ask and answer questions', () => {
  let page: StudentQuestions;

  beforeEach(() => {
    page = new StudentQuestions();
  });

  it('should ask question', () => {
    //login
    page.navigateTo();
    page.getEmailTextbox().sendKeys('s@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();

    page.getSessionList();
    page.getSession();
    page.getViewButton().click();
    page.getStudentSessionView();
    //page.getAskQuestionSection();
    page.getAskQuestion();
    page.getAskQuestionButton().click();
    page.getModalBody();
    page.getStep().sendKeys('1');
    //page.getEditor().evaluate("questionMessage = '{\"ops\":[{\"insert\":\"test question\\n\"}]}';");
    page.getSubmitQuestion().click();
  });

})
