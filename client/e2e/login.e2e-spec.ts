import { LoginPage } from './login.po';
describe('Login tests', () => {
    let page: LoginPage;
    beforeEach(() => {
        page = new LoginPage();
        page.navigateTo();
    });

    it('Login form should be valid student', () => {
     page.getEmailTextbox().sendKeys('stu2@test.com');
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
   page.getEmailTextbox().sendKeys('prof2@test.com');
   page.getPasswordTextbox().sendKeys('password');
   let form = page.getForm().getAttribute('class');
   expect(form).toContain('ng-valid');
});
});
