import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { API_SERVER } from './app.config';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ModelFactoryService } from './services/model-factory.service';
import { UserService } from './services/user.service';
import { LabSessionService } from './services/labsession.service';
import { QuestionService } from './services/question.service';
import { AddAuthorizationInterceptorService } from './services/add-authorization-interceptor.service';

import { HelpmeRoutingModule } from './helpme-routing.module';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { SessionListComponent } from './components/session-list/session-list.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FacultyDashboardComponent } from './components/faculty-dashboard/faculty-dashboard.component';
import { StartSessionComponent } from './components/start-session/start-session.component';
import { CourseService } from './services/course.service';
import { CreateCourseFormComponent } from './components/create-course-form/create-course-form.component';
import { SessionViewComponent } from './components/session-view/session-view.component';
import { StudentSessionViewComponent } from './components/student-session-view/student-session-view.component';
import { FacultySessionViewComponent } from './components/faculty-session-view/faculty-session-view.component';
import { AnswerModalComponent } from './components/answer-modal/answer-modal.component';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { AssignModalComponent } from './components/assign-modal/assign-modal.component';
import { UserManagementModule } from "./user-management/user-management.module";
import { AskQuestionComponent } from './components/ask-question/ask-question.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { QuillModule } from 'ngx-quill';
const Server = '/api';
//Custom angular notifier options
const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserProfileComponent,
    StudentDashboardComponent,
    SessionListComponent,
    QuestionListComponent,
    HomeComponent,
    DashboardComponent,
    FacultyDashboardComponent,
    StartSessionComponent,
    CreateCourseFormComponent,
    SessionViewComponent,
    StudentSessionViewComponent,
    FacultySessionViewComponent,
    AnswerModalComponent,
    EditModalComponent,
    AssignModalComponent,
		AskQuestionComponent
  ],
  imports: [
    BrowserModule, NgbModule.forRoot(), FormsModule, HelpmeRoutingModule, UserManagementModule, HttpClientModule, NotifierModule.withConfig(customNotifierOptions), QuillModule
  ],

  providers: [
    UserService,
    LabSessionService,
    QuestionService,
    CourseService,
    ModelFactoryService,
    NgbActiveModal,
    {
      provide: HTTP_INTERCEPTORS, useClass: AddAuthorizationInterceptorService, multi: true
    },
    {
      provide: API_SERVER, useValue: Server
    }
  ],
	exports: [
		LoginComponent
	],
  bootstrap: [AppComponent],
  entryComponents:[EditModalComponent, AnswerModalComponent, AssignModalComponent]
})
export class AppModule { }
