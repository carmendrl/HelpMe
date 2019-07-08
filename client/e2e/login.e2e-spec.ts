import { LoginPage } from './login.po';

xdescribe('Login tests', () => {
    let page: LoginPage;

    beforeEach(() => {
        page = new LoginPage();
        page.navigateTo();
    });

    var child_process = require('child_process');
    child_process.exec('rails runner ~/help-me-web/scripts/loginTestSetup.rb',
    function(err, stdout, stderr){
      if(err){
        console.log("child processes failed with error code: " + err.code);
      }
    });

    it('should have right title',() =>{
      page.getPageTitle()
      .then((title:string) =>{
        expect(title).toEqual('Log into Help Me');
      });
    });

    it('Login form should be valid student', () => {
     page.getEmailTextbox().sendKeys('s@test.com');
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
   page.getEmailTextbox().sendKeys('p@test.com');
   page.getPasswordTextbox().sendKeys('password');
   let form = page.getForm().getAttribute('class');
   expect(form).toContain('ng-valid');
});

});
