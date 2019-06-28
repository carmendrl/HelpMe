import { StudentMeToo } from './studentMeToo.po';
import { browser } from 'protractor';

xdescribe('press meToo button', () =>{
  let page: StudentMeToo;

  beforeEach(() => {
    page = new StudentMeToo();
  });

  it('should press meToo', () => {
    page.navigateTo();
    //login
    page.getEmailTextbox().sendKeys('s@test.com');
    page.getPasswordTextbox().sendKeys('password');
     page.getSubmitButton().click();
     page.getViewButton().click();
     let a = page.getMyQslength().then((i:number) => {return i+1});
     let b = page.getOtherQslength().then((i:number) => {return i-1});
     page.getOtherOpen().click();
     //page.getQuestion(0);
    page.getMeTooButton(0);
     // browser.sleep(6000);
     expect(page.getMyQslength()).toBe(a);
     expect(page.getOtherQslength()).toBe(b);
  });

  //logout
  it('should open profile menu',() =>{
    page.navigateTo();
    expect(page.getProfileMenuComponent()).toBeTruthy();
    expect(page.getProfileMenu()).toBeTruthy();
  });

  it('should log out', () =>{
    page.getProfileMenu().click();
    page.getLogoutButton().click();
  });
})
