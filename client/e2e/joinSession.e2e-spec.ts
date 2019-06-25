import { JoinSession } from './joinSession.po';
import { browser } from 'protractor';

describe('join a session', () => {
  let page: JoinSession;

  beforeEach(() => {
    page = new JoinSession();
  });

  it('should join a session', () => {
    page.navigateTo();
    page.getTextBox().sendKeys('');
    page.getSubmitButton().click();
    page.getPageTitle().
    then((title:string) => {
      expect(title).toEqual('SessionView - HelpMe');
    });
  });

  // it('should say session has not started yet')
})
