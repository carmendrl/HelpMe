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

  it('should answer a question', () => {
    page.navigateTo2();
    page.getSessionList();
    page.getSession();
    page.getViewButton().click();
    page.getStudentSessionView();

    page.getMyQuestionsList();
    page.getQuestion(0);
    page.getAnswerButton().click();
    page.setUpAnswer();
    page.getSaveButton().click();

    page.navigateTo2();
    page.getSessionList();
    page.getSession();
    page.getViewButton().click();
    page.getMyQuestionsList();
    browser.sleep(6000);
    // page.getQuestion(0);
    // expect(page.getAnswerText()).toBe('test answer');
  });

  //logout
  it('should open profile menu',() =>{
    page.navigateTo();
    expect(page.getProfileMenuComponent()).toBeTruthy();
    expect(page.getProfileMenu()).toBeTruthy();
  });

  it('should log out', () =>{
    page.getProfileMenu().click();
    page.getLogoutButton().click();
  });

})
