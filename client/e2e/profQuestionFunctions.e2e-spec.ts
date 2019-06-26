import { ProfQuestionFunctionsPage } from './profQuestionFunctions.po';
describe('Professor Question Functions', () => {
  let page: ProfQuestionFunctionsPage;

  beforeEach(() => {
    page = new ProfQuestionFunctionsPage();
  });


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


  it('should have right title',() =>{
    page.navigateToLab1();
    page.getPageTitle().then((title:string) =>{
      expect(title).toEqual('Session View - Help Me');
    });
  });

  it('should claim 1st question',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let a = page.getLengthOfMyQs().then((i:number) => {return i+1});
    let b = page.getLengthOfUnclaimedQs().then((i:number) => {return i-1});
    page.getClaimButton(page.getUnclaimedQuestion(0)).click();
    expect(page.getLengthOfUnclaimedQs()).toBe(b);
    expect(page.getLengthOfMyQs()).toBe(a);
  });

  it('should unclaim 1st question',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let a = page.getLengthOfMyQs().then((i:number) => {return i-1});
    let b = page.getLengthOfUnclaimedQs().then((i:number) => {return i+1});
    page.getClaimButton(page.getMyQuestion(0)).click();
    expect(page.getLengthOfUnclaimedQs()).toBe(b);
    expect(page.getLengthOfMyQs()).toBe(a);
  });

  it('should delete 1st question in unclaimed',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let b = page.getLengthOfUnclaimedQs().then((i:number) => {return i-1});
    page.getDeleteButton(page.getUnclaimedQuestion(0)).click();
    expect(page.getLengthOfUnclaimedQs()).toBe(b);
  });


});
