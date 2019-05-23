import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { API_SERVER } from './app.config';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
const Server = '/api';

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
  ],
  imports: [
    BrowserModule, NgbModule.forRoot(), FormsModule, HelpmeRoutingModule, HttpClientModule
  ],
  providers: [
    UserService,
    LabSessionService,
    QuestionService,
    CourseService,
    ModelFactoryService,
    {
      provide: HTTP_INTERCEPTORS, useClass: AddAuthorizationInterceptorService, multi: true
    },
    {
      provide: API_SERVER, useValue: Server
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
