import { browser, by, element, Key } from 'protractor';

export class TaViewTests{
  navigateTo(){
    browser.get('/login');
  }
  navigateTo2(){
    browser.get('/dashboard');
  }
  getEmailTextbox() {
    return element(by.name('Email'));
  }
  getPasswordTextbox() {
    return element(by.name('Password'));
  }
  getSubmitButton(){
      return element(by.css('.loginButton'));
  }
  getFacultyDashboard(){
    return element(by.tagName('app-faculty-dashboard'));
  }
  getStudentDashboard(){
    return element(by.tagName('app-student-dashboard'));
  }
  getJoinBox(){
    return element(by.name('join'));
  }
  getProfileMenuComponent(){
    return element(by.tagName('app-user-profile'));
  }

  getProfileMenu() {
    return this.getProfileMenuComponent().element(by.css('.menu'));
  }
  getSwitchButton(){
    return this.getProfileMenu().element(by.name('taSwitch'));
  }
  getSwitchBackButton(){
    return this.getProfileMenu().element(by.name('taSwitchBack'));
  }

  getLogoutButton(){
    return element(by.css('.logout'));
  }

  getStartSessionComponent(){
    return element(by.tagName('app-start-session'));
  }
  getForm(){
    return element(by.css('.startSessionForm'));
  }

  getDescriptionTextBox(){
    return element(by.name('description'));
  }

  getStartDateTextBox(){
    return element(by.name('dp'));
  }

  getStartTimePickerHour(){
    return element(by.name('start_time')).element(by.css('.ngb-tp-hour')).element(by.tagName('input'));
  }

  getStartTimePickerMinute(){
    return element(by.name('start_time')).element(by.css('.ngb-tp-minute')).element(by.tagName('input'));
  }

  getEndDateTextBox(){
    return element(by.name('end_date'));
  }

  getEndTimePickerHour(){
    return element(by.name('end_time')).element(by.css('.ngb-tp-hour')).element(by.tagName('input'));
  }

  getEndTimePickerMinute(){
    return element(by.name('end_time')).element(by.css('.ngb-tp-minute')).element(by.tagName('input'));
  }

  getPMButton(){
    return element(by.name('end_time')).element(by.css('.btn-outline-primary'));
  }
  setUpSession(){
    this.getStartSessionComponent();
    this.getForm();
    this.getDescriptionTextBox().sendKeys('test session');
    this.getStartDateTextBox().sendKeys('2019-06-26');
    this.getStartTimePickerHour().sendKeys('10');
    this.getStartTimePickerMinute().sendKeys('00');
    this.getEndDateTextBox().sendKeys('2019-06-26');
    this.getEndTimePickerHour().sendKeys('05');
    this.getEndTimePickerMinute().sendKeys('30');
    this.getPMButton().click();
  }
  startSession(){
    return element(by.name('start'));
  }
  getSessionList(){
    return element(by.tagName('app-session-list'));
  }
  getViewButton(){
    return this.getSessionList().element(by.name('view'));
  }
  claim(){
    return element(by.name('claim'));
  }
  unclaim(){
    //this.getUnclaimedQuestions();
    return element(by.name('unclaim'));
  }
  faq(){
    return element(by.name('addFaq'))
  }
  getUnclaimedQuestions(){
    this.getFacultySessionView();
    return element(by.id('unclaimedQs'));
  }
  getFaQlist(){
    this.getFacultySessionView();
    return element(by.id('faqs'));
  }
  getMyQuestions(){
    this.getFacultySessionView();
    return element(by.id('claimedQs'));
  }
  getUnclaimedQuestionsLength(){
    return this.getUnclaimedQuestions().all(by.id('questionRow')).count();
  }
  getMyQuestionsLength(){
    this.getFacultySessionView();
    return this.getMyQuestions().all(by.id('questionRow')).count();
  }
  getFaqLength(){
    this.getFacultySessionView();
    return this.getFaQlist().all(by.id('questionRow')).count();
  }
  getFacultySessionView(){
    return element(by.tagName('app-faculty-session-view'));
  }
  getSessionsLength(){
    this.getSessionList();
    return this.getSessionList().all(by.id('tableRow')).count();
  }
  getUnclaimedOpen(){
    return this.getUnclaimedQuestions().element(by.name('open'));
  }
  getMyOpen(){
    return this.getMyQuestions().element(by.name('open'));
  }
  getFaqOpen(){
    return this.getFaQlist().element(by.name('open'));
  }
}
