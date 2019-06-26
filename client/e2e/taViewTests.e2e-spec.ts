import { TaViewTests } from './taViewTests.po';
import { browser } from 'protractor';

describe('ta login and act as student', () => {
  let page: TaViewTests;

  beforeEach(() =>{
    page = new TaViewTests();
  });

  it('should login and get correct dashboard', () => {
    //login
    page.navigateTo();
    page.getEmailTextbox().sendKeys('s1@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();

    //verify that it is the correct dashboard
    expect(page.getFacultyDashboard()).toBeTruthy();
    expect(page.getJoinBox()).toBeTruthy();
  });

  it('should switch to student view and back', () =>{
    page.getProfileMenu().click();
    page.getSwitchButton().click();


    //verify that it is the correct dashboard
    expect(page.getStudentDashboard()).toBeTruthy();

    page.getSwitchBackButton().click();
    expect(page.getFacultyDashboard()).toBeTruthy();
    expect(page.getJoinBox()).toBeTruthy();
  });
});
