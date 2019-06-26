import { ProfEditAnswer } from './profEditAnswer.po';
import { browser, Key } from 'protractor';

describe('Professor is able to edit an answer', () => {
  let page: ProfEditAnswer;

  beforeEach(() => {
    page = new  ProfEditAnswer();
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

it('Click on viewButton of first lab session and take to correct url', () => {
  page.getViewButtonForSession(page.getTableRowForSession(0)).click();
  page.getCurrentUrl().then((url:string) =>{
    expect(url).toEqual('http://localhost:4200/lab_sessions/a6ecef92-77c1-4a29-9b19-0d3cf4fa0602');
  });
});

it('should get the first question in the otherQs list and open edit modal for draft',() =>  {
  page.getCollapseButton(page.getOtherQuestionComponent()).click();
  page.getFinishButton(page.getOtherQuestion(0)).click();
  expect(page.getOpenModalElement()).toBeTruthy();
  expect(page.getOpenModalEditElement()).toBeTruthy();
});

it('should save the draft as submitted answer',() =>{
  page.getSaveButton().click();
  browser.sleep(6000);
  page.navigateTo2();
});
//I already created an answer in postman
//Edit an asnwer

it('should get profile menu',() =>{
  expect(page.getProfileMenuComponent()).toBeTruthy();
  expect(page.getProfileMenu()).toBeTruthy();
});

it('should logout', () =>{
  page.getProfileMenu().click();
  page.getLogoutButton().click();
});

});
