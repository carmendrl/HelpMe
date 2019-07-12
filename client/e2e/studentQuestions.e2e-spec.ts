import { StudentQuestions } from './studentQuestions.po';
import { browser } from 'protractor';


xdescribe('test ask and answer questions', () => {
  let page: StudentQuestions;


  beforeEach(() => {
    page = new StudentQuestions();
    var child_process = require('child_process');
    child_process.exec('rails runner ~/help-me-web/scripts/studentQuestionsSetUp.rb',
    function(err, stdout, stderr){
      if(err){
        console.log("child processes failed with error code: " + err.code);
      }
    });
  });

  it('should ask question and answer question', () => {
    //login
    page.navigateTo();
    page.getEmailTextbox().sendKeys('s@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();
    page.getSessionList();
    page.getSession();
    page.getViewButton().click();
    page.getStudentSessionView()
    //page.getAskQuestionSection();
    page.getAskQuestion();
    page.getAskQuestionButton().click();
    page.getModalBody();
    page.getStep().sendKeys('1');
    page.getEditor().sendKeys('Test Question');
    browser.sleep(6000);
    page.getSubmitQuestion().click();
    browser.sleep(6000);


    page.navigateTo2();
    page.getSessionList();
    page.getSession();
    page.getViewButton().click();
    page.getStudentSessionView();

    page.getMyQuestionsList();
    page.getMyQsOpen().click();
    page.getQuestion(0);
    //browser.sleep(6000);

    page.getAnswerButton().click();
    page.setUpAnswer();
    page.getSaveButton().click();

    page.navigateTo2();
    page.getSessionList();
    page.getSession();
    page.getViewButton().click();
    page.getMyQuestionsList();
    //browser.sleep(6000);
    // page.getQuestion(0);
    // expect(page.getAnswerText()).toBe('test answer');
  });

  //logout
  it('should open profile menu',() =>{
    //login
    page.navigateTo();
    page.getEmailTextbox().sendKeys('s@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();

    page.navigateTo();
    expect(page.getProfileMenuComponent()).toBeTruthy();
    expect(page.getProfileMenu()).toBeTruthy();
  });

  it('should log out', () =>{
    //login
    page.navigateTo();
    page.getEmailTextbox().sendKeys('s@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();

    page.getProfileMenu().click();
    page.getLogoutButton().click();
  });

})
