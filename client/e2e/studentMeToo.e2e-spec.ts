import { StudentMeToo } from './studentMeToo.po';
import { browser } from 'protractor';

describe('press meToo button', () =>{
  let page: StudentMeToo;

  beforeEach(() => {
    page = new StudentMeToo();
  });

  it('should press meToo', () => {
    page.navigateTo();
    //login
    page.getEmailTextbox().sendKeys('s@test.com');
    page.getPasswordTextbox().sendKeys('password');
     page.getSubmitButton().click();

    page.getSessionList();
    page.getSession();
    page.getViewButton().click();
    page.getAllQuestionsList();
    page.getQuestionListHeader();
    page.getOpenButton().click();
    browser.sleep(6000);
  //expect(page.getQuestion()).toBeTruthy();
    page.getTable();
    page.getButtons();
    //page.getMeTooButton().click();
    // page.getStudentSessionView();
    // page.getMyQuestionsList();
    // page.getQuestion();
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
