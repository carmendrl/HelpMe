import { ProfAssignQuestion } from './profAssignQuestion.po';
import { browser, Key } from 'protractor';

xdescribe('Professor is able to assign questions to TA', () =>{
  let page: ProfAssignQuestion;

  beforeEach(() => {
    page = new ProfAssignQuestion();
  });

  it('should display the right title', () =>{
    var child_process = require('child_process');
    child_process.exec('rails runner ~/help-me-web/scripts/assignQuestionTestSetup.rb',
    function(err, stdout, stderr){
      if(err){
        console.log("child processes failed with error code: " + err.code);
      }
    });
    page.navigateTo();
    page.getEmailTextbox().sendKeys('prof0@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();
    page.getPageTitle().then((title:string) => {
        expect(title).toEqual('Dashboard - Help Me');
      });
  });

  it('should get the view session button to enter the session view', () => {
browser.sleep(5000);
    page.getViewButtonForSession(page.getTableRowForSession(0)).click();
    page.getCurrentUrl().then((url:string) =>{
      expect(url).toEqual('http://localhost:4200/lab_sessions/a6ecef92-77c1-4a29-9b19-0d3cf4fa0602');
    });
    page.getPageTitle().then((title:string) => {
        expect(title).toEqual('Session View - Help Me');
      });
  });

  it('should assign the first question in unclaimedQs to a TA or another professor', () =>{
    //page.getCollapseButton(page.getUnclaimedQuestionList()).click();
    let b = page.getLengthOfUnclaimedQs().then((i:number) => {return i-1});
    let c = page.getLengthOfOtherQs().then((i:number) => {return i+1});
    page.getAssignButton(page.getUnclaimedQuestion(0)).click();
    expect(page.getAssignModal()).toBeTruthy();
    expect(page.getOpenAssignModal()).toBeTruthy();
    page.getPageTitle().then((title:string) => {
      expect(title).toEqual('Assign a Question - Help Me');
    });
    page.getSaveAssignButton().click();
    page.navigateTo2('a6ecef92-77c1-4a29-9b19-0d3cf4fa0602');
    expect(page.getLengthOfUnclaimedQs()).toBe(b);
    expect(page.getLengthOfOtherQs()).toBe(c);
  });

  it('should assign the first question in claimedQs to a TA or another professor', () =>{
    let a = page.getLengthOfOtherQs().then((i:number) => {return i+1});
    let d = page.getLengthOfClaimedQs().then((i:number) => {return i-1});
    page.getCollapseButton(page.getClaimedQuestionsList()).click();
    page.getAssignButton(page.getClaimedQuestion(0)).click();
    expect(page.getAssignModal()).toBeTruthy();
    expect(page.getOpenAssignModal()).toBeTruthy();
    page.getPageTitle().then((title:string) => {
      expect(title).toEqual('Assign a Question - Help Me');
    });
    page.getSaveAssignButton().click();
    page.navigateTo2('a6ecef92-77c1-4a29-9b19-0d3cf4fa0602');
    expect(page.getLengthOfOtherQs()).toBe(a);
    expect(page.getLengthOfClaimedQs()).toBe(d);
  });

  it('should get profile menu',() =>{
    expect(page.getProfileMenuComponent()).toBeTruthy();
    expect(page.getProfileMenu()).toBeTruthy();
  });

  it('should logout', () =>{
    page.getProfileMenu().click();
    page.getLogoutButton().click();
  });

});
