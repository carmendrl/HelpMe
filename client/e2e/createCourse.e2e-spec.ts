import { CreateCourse } from './createCourse.po';
import { browser } from 'protractor';
//import { StartSessionComponent } from '././components/start-session.component';
//import { CreateCourseFormComponent } from '././components/create-course-component.component'

xdescribe('Create course tests', () => {
  let page: CreateCourse;

  beforeEach(() => {
    page = new CreateCourse();
  });

  it('should open modal', () => {
  //page.navigateTo();
  page.getEmailTextbox().sendKeys('professorlogin@test.com');
  page.getPasswordTextbox().sendKeys('password');
   page.getSubmitButton().click();

    page.getCreateCourseButton().click();

    expect(page.getOpenModalElement()).toBeTruthy();
    expect(page.getOpenModalFormElement()).toBeTruthy();
  });

  it('should display right title',() =>{
    page.navigateTo2();
    page.getPageTitle()
    .then((title:string) => {
      expect(title).toEqual('Dashboard - Help Me');
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
 });

 it('create form should be invalid',() =>{
 page.navigateTo2();
 page.getCreateCourseButton().click();
 page.getTitleTextBox().sendKeys('Testing Course Form');
 page.getSubjectTextBox().sendKeys('Test');
 page.getSemester().click();
 page.getYearTextBox().sendKeys('2019');;
 page.getSaveButton().click();
 let form = page.getForm().getAttribute('class');
 expect(form).toContain('ng-invalid');
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
