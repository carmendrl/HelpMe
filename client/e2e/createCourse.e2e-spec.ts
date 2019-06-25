import { CreateCourse } from './createCourse.po';
import { browser } from 'protractor';
//import { StartSessionComponent } from '././components/start-session.component';
//import { CreateCourseFormComponent } from '././components/create-course-component.component'

describe('create course modal opens', () => {
  let page: CreateCourse;

  beforeEach(() => {
    page = new CreateCourse();
  });

  it('should open modal', () => {
   page.navigateTo();
   page.getSubmitButton().click();
   page.getEmailTextbox().sendKeys('p@test.com');
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

  it('should logOut', () => {
    page.getProfileMenuComponent();
    page.getProfileMenu();
    page.getLogoutButton().click();
  }
);


});
