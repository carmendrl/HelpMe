import { TaCreateSession } from './taCreateSession.po';
import { browser } from 'protractor';

xdescribe('ta create session', () =>{
  let page: TaCreateSession;

  beforeEach(() => {
    page = new TaCreateSession();
  });

  it('ta can create sessions', () =>{
    //login
    page.navigateTo();
    page.getEmailTextbox().sendKeys('ta@hope.edu');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();
    page.navigateTo2();
    let a = page.getSessionsLength().then((i:number) => {return i+1});
    page.setUpSession();
    page.startSession().click();
    //browser.sleep(6000);
    page.navigateTo2();
    expect(page.getSessionsLength()).toBe(a);
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
