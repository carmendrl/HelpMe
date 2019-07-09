import { StartSession } from './startSession.po';
import { browser, Key } from 'protractor';

xdescribe('Start session tests', () => {
  let page: StartSession;

  beforeEach(() => {
    page = new StartSession();
  });

  it('should display the right title', () =>{
    page.getEmailTextbox().sendKeys('prof@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();
    page.getPageTitle()
    .then((title:string) => {
        expect(title).toEqual('Dashboard - Help Me');
      }
    );
  });

  it('should get start session component',() => {
    expect(page.getStartSessionComponent()).toBeTruthy();
    expect(page.getForm()).toBeTruthy();
  });

  it('create a session should be invalid', () => {
    page.getDescriptionTextBox().sendKeys('Testing start session');
    page.getStartDateTextBox().sendKeys('2019-06-18');
    page.getEndDateTextBox().sendKeys('2022-07-28');
    page.getStartSessionButton().click();
    let form = page.getForm().getAttribute('class');
    expect(form).toContain('ng-invalid');
  });

  it('create a session should be valid', () => {
    page.getDescriptionTextBox().sendKeys('Testing start session');
    page.getStartDateTextBox().sendKeys('2019-06-18');
    page.getStartTimePickerHour().sendKeys('01');
    page.getStartTimePickerMinute().sendKeys('00');
    page.getEndDateTextBox().sendKeys('2022-07-28');
    page.getEndTimePickerHour().sendKeys('02');
    page.getEndTimePickerMinute().sendKeys('00');
    page.getPMButton().click();
    page.getStartSessionButton().click();
    let form = page.getForm().getAttribute('class');
    expect(form).toContain('ng-valid');
  });

  it('should get profile menu',() =>{
    page.navigateTo();
    expect(page.getProfileMenuComponent()).toBeTruthy();
    expect(page.getProfileMenu()).toBeTruthy();
  });

  it('should logout',()=>{
    page.getProfileMenu().click();
    page.getLogoutButton().click();
  });

});
