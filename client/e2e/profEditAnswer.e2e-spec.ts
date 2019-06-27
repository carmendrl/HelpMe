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

 /**
  *This test works; however, I still need to figure out a way to access the quill
  *editor in order to actually create an answer.
  */
// it('should get the first question in MyQs list,open add modal, and save an answer draft',() =>  {
//   page.getCollapseButton(page.getMyQuestionComponent()).click();
//   browser.sleep(8000);
//   page.getAnswerButton(page.getMyQuestion(0)).click();
//   browser.sleep(8000);
//
//   expect(page.getOpenModalElement2()).toBeTruthy();
//   expect(page.getOpenAnswerModalElement()).toBeTruthy();
//   //add text to the quill-editor
//   page.getSaveDraftButton().click();
// });

//check to see if the text matches

/**
 * The next two tests works; however, we will need to write a script because it will not
 * work if there are no questions.
 */
it('should get the first question in the otherQs list, open edit modal for draft, and save it as another draft',() =>  {
  page.getCollapseButton(page.getOtherQuestionComponent()).click();
  page.getFinishButton(page.getOtherQuestion(3)).click();
  expect(page.getOpenModalElement()).toBeTruthy();
  expect(page.getOpenModalEditElement()).toBeTruthy();
  page.getSaveDraftButton().click();
});
//check to see if the text matches

it('should save the draft as submitted answer',() =>{
  page.getFinishButton(page.getOtherQuestion(3)).click();
  expect(page.getOpenModalElement()).toBeTruthy();
  expect(page.getOpenModalEditElement()).toBeTruthy();
  page.getSaveButton().click();
  //page.navigateTo3('a6ecef92-77c1-4a29-9b19-0d3cf4fa0602');
  browser.sleep(6000);
});

//check to see if the text matches

// it('check if question has been submitted',() =>{
//   browser.sleep(6000);
//   page.getAnswerColumn(0).then((answer:string)=>{
//     expect(answer).toEqual('Boiled water.');
//   });
// });

it('should get profile menu',() =>{
  expect(page.getProfileMenuComponent()).toBeTruthy();
  expect(page.getProfileMenu()).toBeTruthy();
});

it('should logout', () =>{
  page.getProfileMenu().click();
  page.getLogoutButton().click();
});

});
