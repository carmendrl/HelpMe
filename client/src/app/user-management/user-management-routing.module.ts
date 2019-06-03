import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewUserComponent } from './components/new-user/new-user.component';
import { PromoteUserComponent } from './components/promote-user/promote-user.component';

const routes : Routes = [
  {
    'path': 'newuser',
    'component': NewUserComponent
  },
	{
		'path': 'promote',
		'component': PromoteUserComponent
	}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]

})
export class UserManageRoutingModule { }
