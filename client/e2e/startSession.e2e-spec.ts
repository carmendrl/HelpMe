// import { StartSession } from './startSession.po';
// import { browser } from 'protractor';
//
// describe('Start session tests', () => {
//   let page: StartSession;
//
//   beforeEach(() => {
//     page = new StartSession();
//     page.navigateTo();
//   });
//
//   it('should display the right title', () =>{
//     page.getPageTitle()
//     .then((title:string) => {
//         expect(title).toEqual('Dashboard - Help Me');
//       }
//     );
//   });
//
//   it('create a session should be invalid', () => {
//     page.selectACourse().click();
//     page.getDescriptionTextBox().sendKeys('Testing start session');
//     page.getStartDateTextBox().sendKeys('2019-06-18');
//     //page.getStartTimePicker().sendKeys()
//     page.getEndDateTextBox().sendKeys('2022-07-28');
//     //page.getEndDateTextBox().sendKeys()
//     let form = page.getForm().getAttribute('class');
//     expect(form).toContain('ng-invalid');
//   });
//
// });
