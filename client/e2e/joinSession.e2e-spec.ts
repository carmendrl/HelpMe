import { JoinSession } from './joinSession.po';
import { browser } from 'protractor';

describe('join a session', () => {
  let page: JoinSession;

  beforeEach(() => {
    page = new JoinSession();
  });


  it('should join a session', () => {
    //login
    page.navigateTo();
    page.getSubmitButton().click();
    page.getEmailTextbox().sendKeys('studentlogin@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();

    //join session
    page.getStudentDashboard();
    page.getJoinForm();
    page.getTextBox().sendKeys('2fdccf');
    page.getJoinButton().click();
    page.getPageTitle()
    .then((title:string) => {
      expect(title).toEqual('Session View - Help Me');
    });
  });

  it('should open profile menu',() =>{
    page.navigateTo2();
    expect(page.getProfileMenuComponent()).toBeTruthy();
    expect(page.getProfileMenu()).toBeTruthy();
  });

  it('should log out', () =>{
    page.getProfileMenu().click();
    page.getLogoutButton().click();
  });
  // it('should say session has not started yet')
})
