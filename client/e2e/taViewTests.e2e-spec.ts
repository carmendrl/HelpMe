import { TaViewTests } from './taViewTests.po';
import { browser } from 'protractor';

describe('ta login and act as student', () => {
  let page: TaViewTests;

  var child_process = require('child_process');
  child_process.exec('rails runner ~/help-me-web/scripts/setUpTATests.rb', function(err, stdout, stderr){
    if(err){
      console.log("child processes failed with error code: " + err.code);
    }
  });

  beforeEach(() =>{
    page = new TaViewTests();
  });

  it('should login and get correct dashboard', () => {
    //login
    page.navigateTo();
    page.getEmailTextbox().sendKeys('ta@hope.edu');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();
    //verify that it is the correct dashboard
    expect(page.getFacultyDashboard()).toBeTruthy();
    expect(page.getJoinBox()).toBeTruthy();
  });

  it('should switch to student view and back', () =>{
    page.getProfileMenu().click();
    page.getSwitchButton().click();

    //verify that it is the correct dashboard
    expect(page.getStudentDashboard()).toBeTruthy();
      //browser.sleep(6000);
    page.getProfileMenu().click();
    //  browser.sleep(6000);
    page.getSwitchBackButton().click();
    //  browser.sleep(6000);
    expect(page.getFacultyDashboard()).toBeTruthy();
    expect(page.getJoinBox()).toBeTruthy();
  });


  it('ta can claim and unclaim a question', () =>{
//claim
    page.navigateTo2();
    page.getSessionList();
    //page.getSession();
    //browser.sleep(10000);
    page.getViewButton().click();
    //browser.sleep(6000);
    let a = page.getMyQuestionsLength().then((i:number) => {return i+1});
    let b = page.getUnclaimedQuestionsLength().then((i:number) => {return i-1});
    page.getUnclaimedOpen();
      //browser.sleep(10000);
    page.claim().click();
    page.navigateTo2();
    page.getSessionList();
    //page.getSession();
    page.getViewButton().click();
    expect(page.getMyQuestionsLength()).toBe(a);
    expect(page.getUnclaimedQuestionsLength()).toBe(b);

    //unclaim
    page.navigateTo2();
    page.getSessionList();
    //page.getSession();
    page.getViewButton().click();
    let c = page.getMyQuestionsLength().then((i:number) => {return i-1});
    let d = page.getUnclaimedQuestionsLength().then((i:number) => {return i+1});
    page.getMyOpen().click();
    page.unclaim().click();
    page.navigateTo2();
    page.getSessionList();
    //page.getSession();
    page.getViewButton().click();
    expect(page.getMyQuestionsLength()).toBe(c);
    expect(page.getUnclaimedQuestionsLength()).toBe(d);
  });

    it('ta can add and remove from faq', () => {
      //add
      page.navigateTo2();
      page.getSessionList();
      page.getViewButton().click();
      //answer a question
      page.getUnclaimedQuestions();
      page.getUnclaimedOpen().click();
      //browser.sleep(10000);
      page.answer().click();
      page.getAnswerModal();
      page.getEditor().sendKeys('test answer');
      page.getSaveButton().click();

      let a= page.getFaqLength().then((i:number) => {return i+1});
      let b = page.getOtherQslength().then((i:number) => {return i-1});
      page.getOtherQuestionsList();
      page.getOtherOpen().click();
      page.faq().click();
      page.navigateTo2();
      page.getSessionList();
      page.getViewButton().click();
      expect(page.getFaqLength()).toBe(a);
      expect(page.getOtherQslength()).toBe(b);

      //remove
      page.navigateTo2();
      page.getSessionList();
      page.getViewButton().click();
      let c = page.getFaqLength().then((i:number) => {return i-1});
      let d = page.getOtherQslength().then((i:number) => {return i+1});
      page.getFaQlist();
      page.getFaqOpen().click();
      page.rFaq().click();
      page.navigateTo2();
      page.getSessionList();
      page.getViewButton().click();
      expect(page.getFaqLength()).toBe(c);
      expect(page.getOtherQslength()).toBe(d);
    });

    it('ta can assign a question', () => {
      page.navigateTo2();
      page.getSessionList();
      page.getViewButton().click();
      let a = page.getUnclaimedQuestionsLength().then((i:number) => {return i-1});
      page.getUnclaimedQuestions();
      page.assign().click();
      page.getAssignModal();
      page.getAssignButton().click();
      page.navigateTo2();
      page.getSessionList();
      page.getViewButton().click();
      expect(page.getUnclaimedQuestionsLength()).toBe(a);
    });

    it('ta can delete a button', () => {
      page.navigateTo2();
      page.getSessionList();
      page.getViewButton().click();
      let a = page.getUnclaimedQuestionsLength().then((i:number) => {return i-1});
      page.getUnclaimedQuestions();
      page.delete().click();
      page.getDeleteModal();
      page.getDeleteButton().click();
      page.navigateTo2();
      page.getViewButton().click();
      expect(page.getUnclaimedQuestionsLength()).toBe(a);
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
});
