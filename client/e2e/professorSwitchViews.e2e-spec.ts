import { ProfessorSwitchViews } from './professorSwitchViews.po';
import { browser, Key } from 'protractor';

xdescribe('Switch Views tests for Professor', () => {
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

it('should join a session as a student', () =>{
  page.getJoinSessionTextBox().sendKeys('2fdccf');
  page.getjoinSessionButton().click();
});

it('should display the right title', () =>{
  page.getPageTitle()
  .then((title:string) => {
      expect(title).toEqual('Session View - Help Me');
    }
  );
});

it('should go back to the dashboard',() =>{
  page.getBackButton().click();
});

it('should get profile menu',() =>{
  expect(page.getProfileMenuComponent()).toBeTruthy();
  expect(page.getProfileMenu()).toBeTruthy();
});

it('should switch back to professor view', () =>{
  page.getProfileMenu().click();
  page.getSwitchButton2().click();
});

});
