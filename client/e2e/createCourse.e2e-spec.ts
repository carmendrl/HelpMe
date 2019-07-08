import { CreateCourse } from './createCourse.po';
import { browser } from 'protractor';

xdescribe('Create course tests', () => {
  let page: CreateCourse;

  beforeEach(() => {
    page = new CreateCourse();
  });

  var child_process = require('child_process');
  child_process.exec('rails runner ~/help-me-web/scripts/createCourseTestSetup.rb',
  function(err, stdout, stderr){
    if(err){
      console.log("child processes failed with error code: " + err.code);
    }
  });

  it('should log in', () => {
  page.getEmailTextbox().sendKeys('professor@hope.edu');
  page.getPasswordTextbox().sendKeys('password');
  page.getSubmitButton().click();
  });

  it('should display right title',() =>{
    page.getPageTitle()
    .then((title:string) => {
      expect(title).toEqual('Create a Course - Help Me');
    }
  );
});

 it('should successfully create a course',() =>{
   page.getTitleTextBox().sendKeys('Testing Course Form');
   page.getSubjectTextBox().sendKeys('Test');
   page.getNumberTextBox().sendKeys('02');
   page.getSemester().click();
   page.getSaveButton().click();
 });

it('create form should be invalid',() =>{
 page.getCreateCourseButton().click();
 expect(page.getOpenModalElement()).toBeTruthy();
 expect(page.getOpenModalFormElement()).toBeTruthy();
 page.getTitleTextBox().sendKeys('Testing Course Form');
 page.getSubjectTextBox().sendKeys('Test');
 page.getSemester().click();
 page.getYearTextBox().sendKeys('2019');;
 page.getSaveButton().click();
 let form = page.getForm().getAttribute('class');
 expect(form).toContain('ng-invalid');
});

it('create form should be valid',() =>{
 page.navigateTo2();
 page.getCreateCourseButton().click();
 expect(page.getOpenModalElement()).toBeTruthy();
 expect(page.getOpenModalFormElement()).toBeTruthy();
 page.getTitleTextBox().sendKeys('Testing Course Form');
 page.getSubjectTextBox().sendKeys('Test');
 page.getNumberTextBox().sendKeys('03');
 page.getSemester().click();
 page.getYearTextBox().sendKeys('2019');;
 page.getSaveButton().click();
 let form = page.getForm().getAttribute('class');
 expect(form).toContain('ng-valid');
});

it('should open profile menu',() =>{
  page.navigateTo2();
  expect(page.getProfileMenuComponent()).toBeTruthy();
  expect(page.getProfileMenu()).toBeTruthy();
});

it('should log out', () =>{
  page.getProfileMenu().click();
  page.getLogoutButton().click();
});

});
