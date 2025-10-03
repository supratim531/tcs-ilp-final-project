import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login.component";
import { RegisterComponent } from "./register.component";
import { ChangePasswordComponent } from "./change-password.component";

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthRoutingModule,
    FormsModule,
  ],
})
export class AuthModule {}
