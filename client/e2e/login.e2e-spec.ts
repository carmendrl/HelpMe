import { LoginPage } from './login.po';
describe('Login tests', () => {
    let page: LoginPage;

    beforeEach(() => {
        page = new LoginPage();
        page.navigateTo();
    });

    it('should have right title',() =>{
      page.getPageTitle()
      .then((title:string) =>{
        expect(title).toEqual('Log into Help Me');
      });
    });

    it('Login form should be valid student', () => {
     page.getEmailTextbox().sendKeys('studentlogin@test.com');
     page.getPasswordTextbox().sendKeys('password');
     let form = page.getForm().getAttribute('class');
     expect(form).toContain('ng-valid');
});
it('Login form should be invalid', () => {
      page.getEmailTextbox().sendKeys('');
      page.getPasswordTextbox().sendKeys('');

      let form = page.getForm().getAttribute('class');

      expect(form).toContain('ng-invalid');
  });
  it('Login form should be valid professor', () => {
   page.getEmailTextbox().sendKeys('professorlogin@test.com');
   page.getPasswordTextbox().sendKeys('password');
   let form = page.getForm().getAttribute('class');
   expect(form).toContain('ng-valid');
   page.getSubmitButton().click();
});

});
