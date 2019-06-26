import { TaViewTests } from './taViewTests.po';
import { browser } from 'protractor';

describe('ta login and act as student', () => {
  let page: TaViewTests;

  beforeEach(() =>{
    page = new TaViewTests();
  });

  it('should login and get correct dashboard', () => {
    //login
    page.navigateTo();
    page.getEmailTextbox().sendKeys('s1@test.com');
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
    page.getProfileMenu().click();
    page.getSwitchBackButton().click();
    expect(page.getFacultyDashboard()).toBeTruthy();
    expect(page.getJoinBox()).toBeTruthy();
  });

  it('ta can create sessions', () =>{
    page.navigateTo2();
    let a = page.getSessionsLength().then((i:number) => {return i+1});
    page.setUpSession();
    page.startSession().click();
    //browser.sleep(6000);
    page.navigateTo2();
    expect(page.getSessionsLength()).toBe(a);
  });

  it('ta can claim a question', () =>{
    page.navigateTo2();
    page.getSessionList();
    //page.getSession();
    page.getViewButton().click();
    //browser.sleep(6000);
    let a = page.getMyQuestionsLength().then((i:number) => {return i+1});
    let b = page.getUnclaimedQuestionsLength().then((i:number) => {return i-1});
    page.getUnclaimedOpen();
    page.claim().click();
    page.navigateTo2();
    page.getSessionList();
    //page.getSession();
    page.getViewButton().click();
    expect(page.getMyQuestionsLength()).toBe(a);
    expect(page.getUnclaimedQuestionsLength()).toBe(b);
  });
  it('ta can unclaim a question', () =>{
    page.navigateTo2();
    page.getSessionList();
    //page.getSession();
    page.getViewButton().click();
    let a = page.getMyQuestionsLength().then((i:number) => {return i-1});
    let b = page.getUnclaimedQuestionsLength().then((i:number) => {return i+1});
    page.getMyOpen().click();
    page.unclaim().click();
    page.navigateTo2();
    page.getSessionList();
    //page.getSession();
    page.getViewButton().click();
    expect(page.getMyQuestionsLength()).toBe(a);
    expect(page.getUnclaimedQuestionsLength()).toBe(b);
    });

    it('ta can add to faq', () => {
      page.getFaQlist();
      page.getFaqOpen().click();
      page.faq().click();
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
