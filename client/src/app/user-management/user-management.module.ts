import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserManageRoutingModule } from './user-management-routing.module';
import { NewUserComponent } from './components/new-user/new-user.component';
import { PromoteUserComponent } from './components/promote-user/promote-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPromotionRequestComponent } from './components/confirm-promotion-request/confirm-promotion-request.component';

@NgModule({
  declarations: [NewUserComponent, PromoteUserComponent, ConfirmPromotionRequestComponent],
	exports: [
		NewUserComponent
	],
  imports: [
    CommonModule, FormsModule, UserManageRoutingModule, NgbModule.forRoot()
  ]
})
export class UserManagementModule { }
