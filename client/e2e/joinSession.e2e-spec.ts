import { JoinSession } from './joinSession.po';
import { browser } from 'protractor';

xdescribe('join a session', () => {
  let page: JoinSession;

  beforeEach(() => {
    page = new JoinSession();
  });

  it('should join a session', () => {
    var child_process = require('child_process');
    child_process.exec('rails runner ~/help-me-web/scripts/joinSessionTestSetup.rb',
    function(err, stdout, stderr){
      if(err){
        console.log("child processes failed with error code: " + err.code);
      }
    });
    //login
    page.navigateTo();
    page.getSubmitButton().click();
    page.getEmailTextbox().sendKeys('student@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();
    //join session
    page.getStudentDashboard();
    page.getJoinForm();
    page.getTextBox().sendKeys('340a6f');
    page.getJoinButton().click();
    page.getStudentSessionView();
});

it('should join another session', () => {
    page.navigateTo2();
    page.getJoinForm();
    page.getTextBox().sendKeys('077dd8');
    page.getJoinButton().click();
    expect(page.getModal()).toBeTruthy();
})

it('should say token invalid', () => {
    page.navigateTo2();
    page.getJoinForm();
    page.getTextBox().sendKeys('077hy8');
    page.getJoinButton().click();

    expect(page.getAlert()).toBeTruthy();
})

  it('should open profile menu',() =>{
    page.navigateTo2();
    expect(page.getProfileMenuComponent()).toBeTruthy();
    expect(page.getProfileMenu()).toBeTruthy();
  });

  it('should log out', () =>{
    page.getProfileMenu().click();
    page.getLogoutButton().click();
  });


});
