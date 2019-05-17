import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

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
