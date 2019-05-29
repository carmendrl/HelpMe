import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SessionViewComponent } from './components/session-view/session-view.component';

const routes : Routes = [
  {
    'path': 'login',
    'component': LoginComponent
  },
  {
    'path': 'dashboard',
    'component': DashboardComponent
  },
  {
    'path':'lab_sessions/:id',
    'component': SessionViewComponent
  },
  {
    'path': '',
    'component': HomeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]

})
export class HelpmeRoutingModule { }
