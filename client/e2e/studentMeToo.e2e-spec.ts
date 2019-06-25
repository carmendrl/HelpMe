import { StudentMeToo } from './studentMeToo';
import { browser } from 'protractor';

describe('press meToo button', () =>{
  let page: StudentMeToo;

  beforeEach(() => {
    page = new StudentMeToo();
  });

  it('should press meToo', () => {
    page.navigateTo();
    page.getSessionList();
    page.getSession();
    page.getViewButton().click();
    page.getAllQuestionsList();
    page.getQuestion();
    page.getMeTooButton().click();
    page.getStudentSessionView();
    page.getMyQuestionsList();
    page.getQuestion();
  })
})
