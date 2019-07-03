import { CreateCourse } from './createCourse.po';
import { browser } from 'protractor';
//import { StartSessionComponent } from '././components/start-session.component';
//import { CreateCourseFormComponent } from '././components/create-course-component.component'

describe('Create course tests', () => {
  let page: CreateCourse;

  beforeEach(() => {
    page = new CreateCourse();
  });


  it('should log in', () => {
  //page.navigateTo();
  var child_process = require('child_process');
  child_process.exec('rails runner ~/help-me-web/scripts/createCourseTestSetup.rb',
  function(err, stdout, stderr){
    if(err){
      console.log("child processes failed with error code: " + err.code);
    }
  });

  page.getEmailTextbox().sendKeys('professor@hope.edu');
  page.getPasswordTextbox().sendKeys('password');
   page.getSubmitButton().click();

    // page.getCreateCourseButton().click();
    //
    // expect(page.getOpenModalElement()).toBeTruthy();
    // expect(page.getOpenModalFormElement()).toBeTruthy();
  });

  xit('should display right title',() =>{
    //page.navigateTo2();
    page.getPageTitle()
    .then((title:string) => {
      expect(title).toEqual('Create a Course - Help Me');
    }
  );
});

 it('should successfully create a course',() =>{
   page.getCreateCourseButton().click();
   page.getTitleTextBox().sendKeys('Testing Course Form');
   page.getSubjectTextBox().sendKeys('Test');
   page.getNumberTextBox().sendKeys('01');
   page.getSemester().click();
   page.getYearTextBox().sendKeys('2019');
   page.getSaveButton().click();
   let form = page.getForm().getAttribute('class');
   expect(form).toContain('ng-valid');
   browser.sleep(6000);
 });

 xit('create form should be invalid',() =>{
 page.navigateTo2();
 browser.sleep(6000);
 page.getCreateCourseButton().click();
 page.getTitleTextBox().sendKeys('Testing Course Form');
 page.getSubjectTextBox().sendKeys('Test');
 page.getSemester().click();
 page.getYearTextBox().sendKeys('2019');;
 page.getSaveButton().click();
 let form = page.getForm().getAttribute('class');
 expect(form).toContain('ng-invalid');
});

xit('should open profile menu',() =>{
  page.navigateTo2();
  expect(page.getProfileMenuComponent()).toBeTruthy();
  expect(page.getProfileMenu()).toBeTruthy();
});

xit('should log out', () =>{
  page.getProfileMenu().click();
  page.getLogoutButton().click();
});

});
