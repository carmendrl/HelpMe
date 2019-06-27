import { ProfAssignQuestion } from './profAssignQuestion.po';
import { browser, Key } from 'protractor';

describe('Professor is able to assign questions to TA', () =>{
  let page: ProfAssignQuestion;

  beforeEach(() => {
    page = new ProfAssignQuestion();
  });

  it('should display the right title', () =>{
    page.navigateTo();
    page.getEmailTextbox().sendKeys('professorlogin@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();
    page.getPageTitle()
    .then((title:string) => {
        expect(title).toEqual('Dashboard - Help Me');
      });
  });

  it('should get profile menu',() =>{
    expect(page.getProfileMenuComponent()).toBeTruthy();
    expect(page.getProfileMenu()).toBeTruthy();
  });

  it('should logout', () =>{
    page.getProfileMenu().click();
    page.getLogoutButton().click();
  });

});
