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
    page.getEmailTextbox().sendKeys('p@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();

    //join session
    page.getTextBox().sendKeys('8bd201');
    page.getJoinButton().click();
    page.getPageTitle().
    then((title:string) => {
      expect(title).toEqual('Session View - HelpMe');
    });
  });

  // it('should say session has not started yet')
})
