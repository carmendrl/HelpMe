import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewUserComponent } from './components/new-user/new-user.component';
import { PromoteUserComponent } from './components/promote-user/promote-user.component';
import { ConfirmPromotionRequestComponent } from './components/confirm-promotion-request/confirm-promotion-request.component';

const routes : Routes = [
  {
    'path': 'newuser',
    'component': NewUserComponent
  },
	{
		'path': 'promote',
		'component': PromoteUserComponent
	},
	{
		'path': 'confirm-promotion',
		'component': ConfirmPromotionRequestComponent
	},
	{
		'path': 'confirm-promotion/:request-id',
		'component': ConfirmPromotionRequestComponent
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
