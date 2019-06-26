import { AppPage } from './app.po';

xdescribe('help-me App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('The HelpMe App');
  });
});
