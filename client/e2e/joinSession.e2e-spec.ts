// import { JoinSession } from './joinSession.po';
// import { browser } from 'protractor';
//
// describe('join a session', () => {
//   let page: JoinSession;
//
//   beforeEach(() => {
//     page = new JoinSession();
//   });
//
//
//   it('should join a session', () => {
//     //login
//     page.navigateTo();
//     page.getSubmitButton().click();
//     page.getEmailTextbox().sendKeys('s@test.com');
//     page.getPasswordTextbox().sendKeys('password');
//     page.getSubmitButton().click();
//
//     //join session
//     page.getStudentDashboard();
//     page.getJoinForm();
//     page.getTextBox().sendKeys('8bd201');
//     page.getJoinButton().click();
//     page.getStudentSessionView();
// });
//
// it('should say session has not started yet', () => {
//     page.navigateTo2();
//     page.getJoinForm();
//     page.getTextBox().sendKeys('');
//     page.getJoinButton().click();
//     expect(page.getModal()).toBeTruthy();
// })
//
// it('should say token invalid', () => {
//     page.navigateTo2();
//     page.getJoinForm();
//     page.getTextBox().sendKeys('d90ee7');
//     page.getJoinButton().click();
//     expect(page.getAlert()).toBeTruthy();
// })
//
//   it('should open profile menu',() =>{
//     page.navigateTo2();
//     expect(page.getProfileMenuComponent()).toBeTruthy();
//     expect(page.getProfileMenu()).toBeTruthy();
//   });
//
//   it('should log out', () =>{
//     page.getProfileMenu().click();
//     page.getLogoutButton().click();
//   });
//
//
// });
