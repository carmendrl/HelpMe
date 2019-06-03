import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserManageRoutingModule } from './user-management-routing.module';
import { NewUserComponent } from './components/new-user/new-user.component';
import { PromoteUserComponent } from './components/promote-user/promote-user.component';

@NgModule({
  declarations: [NewUserComponent, PromoteUserComponent],
	exports: [
		NewUserComponent
	],
  imports: [
    CommonModule, FormsModule, UserManageRoutingModule
  ]
})
export class UserManagementModule { }
