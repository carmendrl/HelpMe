import { ProfQuestionFunctionsPage } from './profQuestionFunctions.po';
xdescribe('Professor Question Functions', () => {
  let page: ProfQuestionFunctionsPage;


  beforeEach(() => {
    page = new ProfQuestionFunctionsPage();
  });
  //must log in and out in every file?
  var child_process = require('child_process');
  child_process.exec('rails runner ~/help-me-web/scripts/profQuestionFunctionsScript.rb',
  function(err, stdout, stderr){
    if(err){
      console.log("child processes failed with error code: " + err.code);
    }
  });

  it('Click on viewButton of first lab session and take to correct url', () => {
    page.navigateTo();
    page.getEmailTextbox().sendKeys('prof@hope.edu');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();
    page.getViewButtonForSession(page.getTableRowForSession(0)).click();
    page.getCurrentUrl().then((url:string) =>{
      expect(url).toEqual('http://localhost:4200/lab_sessions/d82fabc9-0976-4f6f-8bb1-b8ec9f16a395');
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
//pssible set up is:  4 in unclaimed, 3 in my questions(claimed), 0 in faqs, 3 in other questions

//after button is clicked, page is re-navigated to as a "manuel-refresh"
//in addition to list lengths being checked it is made sure that the actual question is
//where it is supposed to be.
  it('should claim 1st question',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let a = page.getElementArrayLength(page.getQuestionElementArray(page.getMyQuestionComponent())).then((i:number) => {return i+1});
    let b = page.getElementArrayLength(page.getQuestionElementArray(page.getUnclaimedQuestionComponent())).then((i:number) => {return i-1});
    let q = page.getQuestionElement(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()), 0);
    let id= page.getQuestionId(q); //id to compare at end
    page.getClaimButton(q).click();

    page.navigateToLab1();
    expect(page.getElementArrayLength(page.getQuestionElementArray(page.getMyQuestionComponent()))).toBe(a);
    expect(page.getElementArrayLength(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()))).toBe(b);
    expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getMyQuestionComponent()))).toContain(id);
    expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()))).not.toContain(id);
  });

  it('should unclaim 1st question',() =>{
    page.navigateToLab1();
    let a = page.getElementArrayLength(page.getQuestionElementArray(page.getMyQuestionComponent())).then((i:number) => {return i-1});
    let b = page.getElementArrayLength(page.getQuestionElementArray(page.getUnclaimedQuestionComponent())).then((i:number) => {return i+1});
    page.getCollapseButton(page.getMyQuestionComponent()).click();
    let q = page.getQuestionElement(page.getQuestionElementArray(page.getMyQuestionComponent()), 0);
    let id= page.getQuestionId(q); //id to compare at end
    page.getUnclaimButton(q).click();

    page.navigateToLab1();
    expect(page.getElementArrayLength(page.getQuestionElementArray(page.getMyQuestionComponent()))).toBe(a);
    expect(page.getElementArrayLength(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()))).toBe(b);
    expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getMyQuestionComponent()))).not.toContain(id);
    expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()))).toContain(id);

  });


//COMMENTED OUT BECAUSE DOESN"T WORK (YET?)
  xit('should delete 1st question in unclaimed',() =>{
    //need to make sure enough questions in the list.
  page.navigateToLab1();
  let b = page.getElementArrayLength(page.getQuestionElementArray(page.getUnclaimedQuestionComponent())).then((i:number) => {return i-1});
  let q = page.getQuestionElement(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()), 0);
  let id= page.getQuestionId(q); //id to compare at end
  page.getDeleteButton(q).click();

  page.navigateToLab1();
  expect(page.getElementArrayLength(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()))).toBe(b);
  expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()))).not.toContain(id);
  });

  it('should add 1st question in other to faq',() =>{
    //need to make sure enough questions in the list.
    page.navigateToLab1();
    let a = page.getElementArrayLength(page.getQuestionElementArray(page.getOtherQuestionComponent())).then((i:number) => {return i-1});
    let b = page.getElementArrayLength(page.getQuestionElementArray(page.getFaqComponent())).then((i:number) => {return i+1});
    page.getCollapseButton(page.getOtherQuestionComponent()).click();
    let q = page.getQuestionElement(page.getQuestionElementArray(page.getOtherQuestionComponent()), 0);
    let id= page.getQuestionId(q); //id to compare at end
    page.getAddFaqButton(q).click();

    page.navigateToLab1();
    expect(page.getElementArrayLength(page.getQuestionElementArray(page.getOtherQuestionComponent()))).toBe(a);
    expect(page.getElementArrayLength(page.getQuestionElementArray(page.getFaqComponent()))).toBe(b);
    expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getOtherQuestionComponent()))).not.toContain(id);
    expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getFaqComponent()))).toContain(id);
  });

  it('should remove 1st question faq (and move back to other)',() =>{
    page.navigateToLab1();
    let a = page.getElementArrayLength(page.getQuestionElementArray(page.getOtherQuestionComponent())).then((i:number) => {return i+1});
    let b = page.getElementArrayLength(page.getQuestionElementArray(page.getFaqComponent())).then((i:number) => {return i-1});
    page.getCollapseButton(page.getFaqComponent()).click();
    let q = page.getQuestionElement(page.getQuestionElementArray(page.getFaqComponent()), 0);
    let id= page.getQuestionId(q); //id to compare at end
    page.getRemoveFaqButton(q).click();

    page.navigateToLab1();
    expect(page.getElementArrayLength(page.getQuestionElementArray(page.getOtherQuestionComponent()))).toBe(a);
    expect(page.getElementArrayLength(page.getQuestionElementArray(page.getFaqComponent()))).toBe(b);
    expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getOtherQuestionComponent()))).toContain(id);
    expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getFaqComponent()))).not.toContain(id);
  });


//BELOW ARE ASSIGN TESTS BUT THEY DON"T HAVE THE MODAL/SELECT STUFF IMPLEMENTED YET

//   it('should assign question from unclaimed to other professor',() =>{
//     page.navigateToLab1();
//     let a = page.getElementArrayLength(page.getQuestionElementArray(page.getUnclaimedQuestionComponent())).then((i:number) => {return i-1});
//     let b = page.getElementArrayLength(page.getQuestionElementArray(page.getOtherQuestionComponent())).then((i:number) => {return i+1});
//     let q = page.getQuestionElement(page.getQuestionElementArray(page.getFaqComponent()), 0);
//     let id= page.getQuestionId(q); //id to compare at end
//     page.getAssignButton(q).click();
//     //have to do modal stuff
//
//     page.navigateToLab1();
//     expect(page.getElementArrayLength(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()))).toBe(a);
//     expect(page.getElementArrayLength(page.getQuestionElementArray(page.getOtherQuestionComponent()))).toBe(b);
//     expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getUnclaimedQuestionComponent()))).not.toContain(id);
//     expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getOtherQuestionComponent()))).toContain(id);
// //also compare assigned to field
//   });
//
//   it('should assign question from My(Claimed)Questions to other professor',() =>{
//     page.navigateToLab1();
//     let a = page.getElementArrayLength(page.getQuestionElementArray(page.getMyQuestionComponent())).then((i:number) => {return i-1});
//     let b = page.getElementArrayLength(page.getQuestionElementArray(page.getOtherQuestionComponent())).then((i:number) => {return i+1});
//     page.getCollapseButton(page.getMyQuestionComponent()).click();
//     let q = page.getQuestionElement(page.getQuestionElementArray(page.getFaqComponent()), 0);
//     let id= page.getQuestionId(q); //id to compare at end
//       page.getAssignButton(q).click();
//       //have to do modal stuff
//
//     page.navigateToLab1();
//     expect(page.getElementArrayLength(page.getQuestionElementArray(page.getMyQuestionComponent()))).toBe(a);
//     expect(page.getElementArrayLength(page.getQuestionElementArray(page.getOtherQuestionComponent()))).toBe(b);
//     expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getMyQuestionComponent()))).not.toContain(id);
//     expect(page.getQuestionIdArray(page.getQuestionElementArray(page.getOtherQuestionComponent()))).toContain(id);
//     //also compare to assigned to field
//   });



});
