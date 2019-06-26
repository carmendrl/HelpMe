import { ProfessorSwitchViews } from './professorSwitchViews.po';
import { browser, Key } from 'protractor';

describe('Switch Views tests for Professor', () => {
  let page: ProfessorSwitchViews;

  beforeEach(() => {
    page = new  ProfessorSwitchViews();
  });

it('should display the right title', () =>{
  page.navigateTo();
  page.getEmailTextbox().sendKeys('professorlogin@test.com');
  page.getPasswordTextbox().sendKeys('password');
  page.getSubmitButton().click();
  page.getPageTitle()
  .then((title:string) => {
      expect(title).toEqual('Dashboard - Help Me');
    }
  );
});

it('should get profile menu',() =>{
  expect(page.getProfileMenuComponent()).toBeTruthy();
  expect(page.getProfileMenu()).toBeTruthy();
});

it('should switch to student view', () =>{
  page.getProfileMenu().click();
  page.getSwitchButton().click();
});

it('should join a session as a student an get the correct url', () =>{
  page.getJoinSessionTextBox().sendKeys('2fdccf');
  page.getjoinSessionButton().click();
  page.getCurrentUrl().then((url:string) =>{
    expect(url).toEqual('http://localhost:4200/lab_sessions/c1d62acf-f600-43ff-9b67-cab6a96f5ba5')
  });
});

it('should display the right title', () =>{
  page.getPageTitle()
  .then((title:string) => {
      expect(title).toEqual('Session View - Help Me');
    }
  );
});

it('should go back to the dashboard and get the right title',() =>{
  page.getBackButton().click();
  page.getPageTitle()
  .then((title:string) => {
      expect(title).toEqual('Dashboard - Help Me');
    }
  );
});

it('should get profile menu',() =>{
  expect(page.getProfileMenuComponent()).toBeTruthy();
  expect(page.getProfileMenu()).toBeTruthy();
});

it('should switch back to professor view', () =>{
  page.getProfileMenu().click();
  page.getSwitchButton2().click();
});

it('should logout',()=>{
  page.getProfileMenu().click();
  page.getLogoutButton().click();
});

});
