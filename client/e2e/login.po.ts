import { browser, by, element } from 'protractor';
export class LoginPage {
    navigateTo(){
        return browser.get('/login');
    }
    getEmailTextbox() {
      return element(by.name('Email'));
    }
    getPasswordTextbox() {
      return element(by.name('Password'));
    }

    getForm(){
        return element(by.css('.loginForm'));
    }

    getSubmitButton(){
        return element(by.css('.loginButton'));
    }

    getPageTitle(){
      return browser.getTitle();
    }
}
