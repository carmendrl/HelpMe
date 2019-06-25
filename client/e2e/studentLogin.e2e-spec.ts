import { browser } from 'protractor';
import { StudentDashboardComponent } from './components/student-dashboard.component';
import { SessionListComponent } from './components/session-list.component';

describe('student dashboard', function () ){
  let page: StudentDashboard;

  beforeEach(() => {
    page = new StudentDashboard();
  });

  it('should go to StudentDashboard', () => {
    page.navigateTo();

    expect(page.getJoinSess()).toBeTruthy();
    expect(page.getSessionList()).toBeTruthy();;

  });
});
