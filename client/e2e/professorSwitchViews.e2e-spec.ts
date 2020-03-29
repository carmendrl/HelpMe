import { ProfessorSwitchViews } from './professorSwitchViews.po';
import { browser, Key } from 'protractor';

xdescribe('Switch Views tests for Professor', () => {
  let page: ProfessorSwitchViews;

  beforeEach(() => {
    page = new  ProfessorSwitchViews();
  });

  var child_process = require('child_process');
  child_process.exec('rails runner ~/help-me-web/scripts/profSwitchViewsSetup.rb',
  function(err, stdout, stderr){
    if(err){
      console.log("child processes failed with error code: " + err.code);
    }
  });

it('should display the right title', () =>{
  page.navigateTo();
  page.getEmailTextbox().sendKeys('prof@test.com');
  page.getPasswordTextbox().sendKeys('password');
  page.getSubmitButton().click();
  page.getPageTitle()
  .then((title:string) => {
      expect(title).toEqual('Dashboard - HelpMe');
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
  page.getJoinSessionTextBox().sendKeys('368fa4');
  page.getjoinSessionButton().click();
  page.getCurrentUrl().then((url:string) =>{
    expect(url).toEqual('http://localhost:4200/lab_sessions/f575fb96-8aec-4e76-9eec-80c5afbd6d00')
  });
});

it('should display the right title', () =>{
  page.getPageTitle()
  .then((title:string) => {
      expect(title).toEqual('Session View - HelpMe');
    }
  );
});

it('should go back to the dashboard and get the right title',() =>{
  page.getActionDropdown().click();
  page.getBackButton().click();
  page.getPageTitle()
  .then((title:string) => {
      expect(title).toEqual('Dashboard - HelpMe');
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
