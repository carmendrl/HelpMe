import { ProfQuestionFunctionsPage } from './profQuestionFunctions.po';
import { Question } from '../src/app/models/question.model';
describe('Professor Question Functions', () => {
  let page: ProfQuestionFunctionsPage;

  beforeEach(() => {
    page = new ProfQuestionFunctionsPage();
  });
  //must login and log out every time.


  it('Click on viewButton of first lab session and take to correct url', () => {
    page.navigateTo();
    page.getEmailTextbox().sendKeys('professorlogin@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();
    page.getViewButtonForSession(page.getTableRowForSession(0)).click();
    page.getCurrentUrl().then((url:string) =>{
      expect(url).toEqual('http://localhost:4200/lab_sessions/16614b98-a4fc-4390-95f9-ae0a80cfedaf');
    });
  });

//re-do navigate to page - like main refresh - also compare actual question content
//rather than just list length
  it('should have right title',() =>{
    page.navigateToLab1();
    page.getPageTitle().then((title:string) =>{
      expect(title).toEqual('Session View - Help Me');
    });
  });


//These tests requies that there be enough questions in the applicable claimedQuestions
//otherwise array-index-out-of-bound errors are likely to occur
//ideal set up is:  ___ in unclaimed, __ in my questions(claimed), ____in faqs, ____in other questions

//after button is clicked, page is re-navigated to as a "manuel-refresh"
//in addition to list lengths being checked it is made sure that the actual question is
//where it is supposed to be.
  it('should claim 1st question',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let a = page.getLengthOfMyQs().then((i:number) => {return i+1});
    let b = page.getLengthOfUnclaimedQs().then((i:number) => {return i-1});
    let q = page.getUnclaimedQuestion(0);//.then((q: Question) => {return q});
    page.getClaimButton(q).click();

    page.navigateToLab1();
    expect(page.getLengthOfUnclaimedQs()).toBe(b);
    expect(page.getLengthOfMyQs()).toBe(a);
    //expect(q.isPresent()).toBe(true);
    //expect(page.getMyQuestions().then((values)=>{return values;})).toContain(q);
  });

  it('should unclaim 1st question',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let a = page.getLengthOfMyQs().then((i:number) => {return i-1});
    let b = page.getLengthOfUnclaimedQs().then((i:number) => {return i+1});
    page.getCollapseButton(page.getMyQuestionComponent()).click();
    let q = page.getMyQuestion(0);//.then((q) => {return q});
    let c= page.getElementValue(q.getWebElement());
    page.slowDown();
    //page.getUnclaimButton(q).click();

    page.navigateToLab1();
    //expect(page.getLengthOfUnclaimedQs()).toBe(b);
    //expect(page.getLengthOfMyQs()).toBe(a);
    //expect(q.isPresent()).toBe(true);
    //let c= q.getWebElement();
    //expect(page.getUnclaimedQuestions().then((values)=>{return values;})).toContain(c);
    //expect(page.getUnclaimedQuestions().then()).toContain(q);
    expect(page.getElementValueArray(page.getMyQuestions())).toContain(c);
  });

  it('should delete 1st question in unclaimed',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let b = page.getLengthOfUnclaimedQs().then((i:number) => {return i-1});
    page.slowDown();
    let q = page.getUnclaimedQuestion(0);//.then((q) => {return q});
    page.getDeleteButton(q).click();

    page.navigateToLab1();
    expect(page.getLengthOfUnclaimedQs()).toBe(b);
    //expect(q.isPresent()).toBe(false);
  });

  it('should add 1st question in other to faq',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let a = page.getLengthOfOther().then((i:number) => {return i-1});
    let b = page.getLengthOfFaq().then((i:number) => {return i+1});
    page.getCollapseButton(page.getOtherQuestionComponent()).click();
    let q = page.getOtherQuestion(0);//.then((q: Question) => {return q});
    page.getAddFaqButton(q).click();

    page.navigateToLab1();
    expect(page.getLengthOfOther()).toBe(a);
    expect(page.getLengthOfFaq()).toBe(b);
  });

  it('should remove 1st question faq (and move back to other)',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let a = page.getLengthOfOther().then((i:number) => {return i+1});
    let b = page.getLengthOfFaq().then((i:number) => {return i-1});
    page.getCollapseButton(page.getFaqComponent()).click();
    let q = page.getFaqQuestion(0);//.then((q: Question) => {return q});
    page.getRemoveFaqButton(q).click();

    page.navigateToLab1();
    expect(page.getLengthOfOther()).toBe(a);
    expect(page.getLengthOfFaq()).toBe(b);
  });


});
